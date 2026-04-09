import React, { createContext, useContext, useState, useCallback } from 'react';

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
  progress: number; // 0-100
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

const sampleShipments: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'FTP-DEMO1234',
    clientName: 'John Doe',
    clientEmail: 'john@example.com',
    origin: 'New York, USA',
    destination: 'London, UK',
    originCoords: [40.7128, -74.006],
    destCoords: [51.5074, -0.1278],
    currentCoords: [45.0, -40.0],
    status: 'in_transit',
    progress: 55,
    estimatedArrival: '2026-04-15',
    createdAt: '2026-04-05',
    updatedAt: '2026-04-09',
    weight: '12.5 kg',
    dimensions: '40x30x20 cm',
    packageType: 'Standard Box',
    route: [],
    history: [
      { id: '1', timestamp: '2026-04-05 08:00', status: 'Package received', location: 'New York, USA', description: 'Package picked up from sender' },
      { id: '2', timestamp: '2026-04-06 14:00', status: 'In transit', location: 'JFK Airport', description: 'Package cleared customs and loaded' },
      { id: '3', timestamp: '2026-04-08 10:00', status: 'In transit', location: 'Mid-Atlantic', description: 'Package in transit via air freight' },
    ],
  },
  {
    id: '2',
    trackingNumber: 'FTP-DEMO5678',
    clientName: 'Jane Smith',
    clientEmail: 'jane@example.com',
    origin: 'Paris, France',
    destination: 'Tokyo, Japan',
    originCoords: [48.8566, 2.3522],
    destCoords: [35.6762, 139.6503],
    currentCoords: [48.8566, 2.3522],
    status: 'pending',
    progress: 5,
    estimatedArrival: '2026-04-20',
    createdAt: '2026-04-08',
    updatedAt: '2026-04-09',
    weight: '3.2 kg',
    dimensions: '25x15x10 cm',
    packageType: 'Envelope',
    route: [],
    history: [
      { id: '1', timestamp: '2026-04-08 16:00', status: 'Order placed', location: 'Paris, France', description: 'Shipment order created' },
    ],
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shipments, setShipments] = useState<Shipment[]>(sampleShipments);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const addShipment = useCallback((shipment: Shipment) => {
    setShipments(prev => [...prev, shipment]);
  }, []);

  const updateShipment = useCallback((id: string, updates: Partial<Shipment>) => {
    setShipments(prev => prev.map(s => s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
  }, []);

  const deleteShipment = useCallback((id: string) => {
    setShipments(prev => prev.filter(s => s.id !== id));
  }, []);

  const addMessage = useCallback((msg: ChatMessage) => {
    setMessages(prev => [...prev, msg]);
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
      shipments, messages, isAdminLoggedIn,
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
