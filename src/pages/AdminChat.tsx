import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChatWidget from '@/components/ChatWidget';

const AdminChat: React.FC = () => {
  const { isAdminLoggedIn, shipments, messages } = useApp();

  if (!isAdminLoggedIn) return <Navigate to="/admin/login" />;

  const unreadFor = (sid: string) => messages.filter(m => m.shipmentId === sid && m.sender === 'client' && !m.readByAdmin).length;

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Chat Center</h1>
        <p className="text-muted-foreground mb-8">Communicate with clients about their shipments</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shipments.map(s => {
            const u = unreadFor(s.id);
            return (
              <div key={s.id}>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="text-xs font-mono">{s.trackingNumber}</Badge>
                  <span className="text-sm text-muted-foreground">{s.clientName}</span>
                  {u > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-xs font-bold">
                      {u} new
                    </span>
                  )}
                </div>
                <ChatWidget shipmentId={s.id} senderRole="admin" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
