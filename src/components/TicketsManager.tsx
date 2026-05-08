import React, { useState } from 'react';
import { Plus, Trash2, Download, FileText, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/context/AppContext';
import type { Ticket, TicketItem, Shipment } from '@/context/AppContext';
import { generateTicketPdf } from '@/lib/ticketPdf';
import { useToast } from '@/hooks/use-toast';

interface Props {
  shipment: Shipment;
}

const newTicketNumber = (type: 'paid' | 'pending') =>
  `${type === 'paid' ? 'RCT' : 'INV'}-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 999)}`;

const TicketsManager: React.FC<Props> = ({ shipment }) => {
  const { tickets, addTicket, deleteTicket } = useApp();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<'paid' | 'pending'>('paid');
  const [title, setTitle] = useState('Transit Fee');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<TicketItem[]>([{ description: 'Transit fee', amount: 0 }]);

  const shipmentTickets = tickets.filter(t => t.shipmentId === shipment.id);
  const total = items.reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const reset = () => {
    setType('paid'); setTitle('Transit Fee'); setCurrency('USD'); setNotes('');
    setItems([{ description: 'Transit fee', amount: 0 }]);
  };

  const handleCreate = () => {
    const ticket: Ticket = {
      id: crypto.randomUUID(),
      shipmentId: shipment.id,
      ticketNumber: newTicketNumber(type),
      ticketType: type,
      title: title || (type === 'paid' ? 'Payment Receipt' : 'Pending Payment'),
      amount: total,
      currency,
      items: items.filter(i => i.description.trim()),
      notes,
      issuedTo: shipment.clientName,
      issuedBy: 'FastTrackerPro Admin',
      createdAt: new Date().toISOString(),
    };
    addTicket(ticket);
    toast({ title: 'Ticket created', description: ticket.ticketNumber });
    setOpen(false); reset();
  };

  const download = (t: Ticket) => generateTicketPdf(t, {
    trackingNumber: shipment.trackingNumber,
    origin: shipment.origin,
    destination: shipment.destination,
    clientName: shipment.clientName,
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2"><Receipt className="w-4 h-4" /> Tickets & Invoices</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="w-3 h-3" /> New Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Create Ticket</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select value={type} onValueChange={v => setType(v as 'paid' | 'pending')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Payment Receipt (Paid)</SelectItem>
                      <SelectItem value="pending">Pending Payment (Due)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <Input value={currency} onChange={e => setCurrency(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Transit Fee Receipt" />
              </div>
              <div>
                <label className="text-sm font-medium">Items</label>
                <div className="space-y-2 mt-1">
                  {items.map((it, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input className="flex-1" placeholder="Description" value={it.description}
                        onChange={e => setItems(arr => arr.map((x, i) => i === idx ? { ...x, description: e.target.value } : x))} />
                      <Input type="number" className="w-28" placeholder="Amount" value={it.amount}
                        onChange={e => setItems(arr => arr.map((x, i) => i === idx ? { ...x, amount: Number(e.target.value) } : x))} />
                      <Button type="button" variant="ghost" size="icon" onClick={() => setItems(arr => arr.filter((_, i) => i !== idx))}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={() => setItems(arr => [...arr, { description: '', amount: 0 }])}>
                    <Plus className="w-3 h-3 mr-1" /> Add line
                  </Button>
                </div>
                <div className="text-right text-sm font-semibold mt-2">Total: {currency} {total.toFixed(2)}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Notes</label>
                <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment instructions, deadlines..." rows={3} />
              </div>
              <Button onClick={handleCreate} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">Create & Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {shipmentTickets.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No tickets yet. Create a payment receipt or pending invoice.</p>
        ) : (
          <div className="space-y-2">
            {shipmentTickets.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-5 h-5 text-secondary flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm truncate">{t.title}</span>
                      <Badge className={t.ticketType === 'paid' ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'}>
                        {t.ticketType === 'paid' ? 'PAID' : 'DUE'}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">{t.ticketNumber} · {t.currency} {t.amount.toFixed(2)}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => download(t)}>
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteTicket(t.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TicketsManager;