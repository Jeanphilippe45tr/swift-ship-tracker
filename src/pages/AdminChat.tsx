import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ChatWidget from '@/components/ChatWidget';

const AdminChat: React.FC = () => {
  const { isAdminLoggedIn, shipments } = useApp();

  if (!isAdminLoggedIn) return <Navigate to="/admin/login" />;

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-foreground mb-2">Chat Center</h1>
        <p className="text-muted-foreground mb-8">Communicate with clients about their shipments</p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shipments.map(s => (
            <div key={s.id}>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-mono">{s.trackingNumber}</Badge>
                <span className="text-sm text-muted-foreground">{s.clientName}</span>
              </div>
              <ChatWidget shipmentId={s.id} senderRole="admin" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
