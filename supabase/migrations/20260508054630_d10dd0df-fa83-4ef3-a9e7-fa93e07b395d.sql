
CREATE TABLE public.tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shipment_id uuid NOT NULL,
  ticket_number text NOT NULL,
  ticket_type text NOT NULL DEFAULT 'paid',
  title text NOT NULL DEFAULT '',
  amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text DEFAULT '',
  issued_to text DEFAULT '',
  issued_by text DEFAULT 'FastTrackerPro Admin',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view tickets" ON public.tickets FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tickets" ON public.tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tickets" ON public.tickets FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete tickets" ON public.tickets FOR DELETE USING (true);

CREATE TRIGGER update_tickets_updated_at
BEFORE UPDATE ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.chat_messages
  ADD COLUMN read_by_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN read_by_client boolean NOT NULL DEFAULT false;

ALTER PUBLICATION supabase_realtime ADD TABLE public.tickets;
