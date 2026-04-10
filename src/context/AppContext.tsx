import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Shipment {
  id: string;
  trackingNumber: string;
  clientName: string;
  clientEmail: string;
  origin: string;
  destination: string;
  originCoords: [number, number] | null;
  destCoords: [number, number] | null;
  currentCoords: [number, number] | null;
  status: 'pending' | 'in_transit' | 'paused' | 'delivered' | 'cancelled';
  pauseReason?: string;
  progress: number;
  estimatedArrival: string;
  createdAt: string;
  updatedAt: string;
  weight: string;
  dimensions: string;
  packageType: string;
  route: [number, number][];
  history: ShipmentEvent[];
}

export interface ShipmentEvent {
  id: string;
  timestamp: string;
  status: string;
  location: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  shipmentId: string;
  sender: 'admin' | 'client';
  message: string;
  timestamp: string;
}

interface AppState {
  shipments: Shipment[];
  messages: ChatMessage[];
  isAdminLoggedIn: boolean;
  loading: boolean;
  addShipment: (shipment: Shipment) => void;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;
  addMessage: (msg: ChatMessage) => void;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  getShipmentByTracking: (tracking: string) => Shipment | undefined;
}

const AppContext = createContext<AppState | null>(null);

const generateTrackingNumber = () => {
  const prefix = 'FTP';
  const num = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `${prefix}-${num}`;
};

// Convert DB row to Shipment
const rowToShipment = (row: any): Shipment => ({
  id: row.id,
  trackingNumber: row.tracking_number,
  clientName: row.client_name,
  clientEmail: row.client_email || '',
  origin: row.origin,
  destination: row.destination,
  originCoords: row.origin_coords as [number, number] | null,
  destCoords: row.dest_coords as [number, number] | null,
  currentCoords: row.current_coords as [number, number] | null,
  status: row.status,
  pauseReason: row.pause_reason || undefined,
  progress: row.progress,
  estimatedArrival: row.estimated_arrival || '',
  createdAt: row.created_at?.split('T')[0] || '',
  updatedAt: row.updated_at?.split('T')[0] || '',
  weight: row.weight || '',
  dimensions: row.dimensions || '',
  packageType: row.package_type || 'Standard Box',
  route: (row.route as [number, number][]) || [],
  history: (row.history as ShipmentEvent[]) || [],
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load shipments from DB
  useEffect(() => {
    const fetchData = async () => {
      const { data: shipmentRows } = await supabase.from('shipments').select('*').order('created_at', { ascending: false });
      if (shipmentRows) setShipments(shipmentRows.map(rowToShipment));

      const { data: msgRows } = await supabase.from('chat_messages').select('*').order('created_at', { ascending: true });
      if (msgRows) setMessages(msgRows.map((m: any) => ({
        id: m.id,
        shipmentId: m.shipment_id,
        sender: m.sender as 'admin' | 'client',
        message: m.message,
        timestamp: new Date(m.created_at).toLocaleString(),
      })));
      setLoading(false);
    };
    fetchData();

    // Realtime chat subscription
    const channel = supabase
      .channel('chat-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
        const m = payload.new as any;
        setMessages(prev => {
          if (prev.some(msg => msg.id === m.id)) return prev;
          return [...prev, {
            id: m.id,
            shipmentId: m.shipment_id,
            sender: m.sender,
            message: m.message,
            timestamp: new Date(m.created_at).toLocaleString(),
          }];
        });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const addShipment = useCallback(async (shipment: Shipment) => {
    setShipments(prev => [shipment, ...prev]);
    await supabase.from('shipments').insert({
      id: shipment.id,
      tracking_number: shipment.trackingNumber,
      client_name: shipment.clientName,
      client_email: shipment.clientEmail,
      origin: shipment.origin,
      destination: shipment.destination,
      origin_coords: shipment.originCoords as any,
      dest_coords: shipment.destCoords as any,
      current_coords: shipment.currentCoords as any,
      status: shipment.status,
      pause_reason: shipment.pauseReason || null,
      progress: shipment.progress,
      estimated_arrival: shipment.estimatedArrival,
      weight: shipment.weight,
      dimensions: shipment.dimensions,
      package_type: shipment.packageType,
      route: shipment.route as any,
      history: shipment.history as any,
    });
  }, []);

  const updateShipment = useCallback(async (id: string, updates: Partial<Shipment>) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : s));
    const dbUpdates: any = {};
    if (updates.trackingNumber !== undefined) dbUpdates.tracking_number = updates.trackingNumber;
    if (updates.clientName !== undefined) dbUpdates.client_name = updates.clientName;
    if (updates.clientEmail !== undefined) dbUpdates.client_email = updates.clientEmail;
    if (updates.origin !== undefined) dbUpdates.origin = updates.origin;
    if (updates.destination !== undefined) dbUpdates.destination = updates.destination;
    if (updates.originCoords !== undefined) dbUpdates.origin_coords = updates.originCoords;
    if (updates.destCoords !== undefined) dbUpdates.dest_coords = updates.destCoords;
    if (updates.currentCoords !== undefined) dbUpdates.current_coords = updates.currentCoords;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.pauseReason !== undefined) dbUpdates.pause_reason = updates.pauseReason;
    if (updates.progress !== undefined) dbUpdates.progress = updates.progress;
    if (updates.estimatedArrival !== undefined) dbUpdates.estimated_arrival = updates.estimatedArrival;
    if (updates.weight !== undefined) dbUpdates.weight = updates.weight;
    if (updates.dimensions !== undefined) dbUpdates.dimensions = updates.dimensions;
    if (updates.packageType !== undefined) dbUpdates.package_type = updates.packageType;
    if (updates.route !== undefined) dbUpdates.route = updates.route;
    if (updates.history !== undefined) dbUpdates.history = updates.history;
    await supabase.from('shipments').update(dbUpdates).eq('id', id);
  }, []);

  const deleteShipment = useCallback(async (id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
    await supabase.from('shipments').delete().eq('id', id);
  }, []);

  const addMessage = useCallback(async (msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
    await supabase.from('chat_messages').insert({
      id: msg.id,
      shipment_id: msg.shipmentId,
      sender: msg.sender,
      message: msg.message,
    });
  }, []);

  const loginAdmin = useCallback((username: string, password: string) => {
    if (username === 'Makoun237' && password === 'Makoun237@p') {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdminLoggedIn(false);
  }, []);

  const getShipmentByTracking = useCallback((tracking: string) => {
    return shipments.find(s => s.trackingNumber.toLowerCase() === tracking.toLowerCase());
  }, [shipments]);

  return (
    <AppContext.Provider value={{
      shipments, messages, isAdminLoggedIn, loading,
      addShipment, updateShipment, deleteShipment,
      addMessage, loginAdmin, logoutAdmin, getShipmentByTracking
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export { generateTrackingNumber };
