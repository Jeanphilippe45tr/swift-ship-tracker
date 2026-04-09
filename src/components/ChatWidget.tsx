import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';

interface ChatWidgetProps {
  shipmentId: string;
  senderRole: 'admin' | 'client';
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ shipmentId, senderRole }) => {
  const [msg, setMsg] = useState('');
  const { messages, addMessage } = useApp();
  const bottomRef = useRef<HTMLDivElement>(null);

  const chatMessages = messages.filter(m => m.shipmentId === shipmentId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg.trim()) return;
    addMessage({
      id: crypto.randomUUID(),
      shipmentId,
      sender: senderRole,
      message: msg.trim(),
      timestamp: new Date().toLocaleString(),
    });
    setMsg('');
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-base">Chat Support</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-64 overflow-y-auto px-4 py-2 space-y-3">
          {chatMessages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">No messages yet. Start a conversation!</p>
          )}
          {chatMessages.map(m => (
            <div key={m.id} className={`flex ${m.sender === senderRole ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                m.sender === senderRole
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}>
                <div className="text-xs opacity-70 mb-0.5">{m.sender === 'admin' ? 'Support' : 'Client'}</div>
                {m.message}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-border">
          <Input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Type a message..." className="flex-1" />
          <Button type="submit" size="icon" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatWidget;
