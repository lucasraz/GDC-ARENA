-- UPDATING EVENTS FOR BEER LOGISTICS AND CONSUMPTION MODES
-- 1. Add pricing and mode to events
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS beer_price_heineken DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS beer_price_brahma DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS beer_price_antarctica DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS beer_price_stella DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS consume_on_site BOOLEAN DEFAULT false;

-- 2. Add selection to attendance
ALTER TABLE public.event_attendees 
ADD COLUMN IF NOT EXISTS selected_beer TEXT DEFAULT 'nenhuma';
