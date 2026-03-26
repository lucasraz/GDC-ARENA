-- UPDATING ATTENDEES FOR GUESTS
ALTER TABLE public.event_attendees ADD COLUMN IF NOT EXISTS guest_name TEXT;
-- We remove the unique constraint to allow multiple attendees (guests) per user per event
ALTER TABLE public.event_attendees DROP CONSTRAINT IF EXISTS event_attendees_event_id_user_id_key;
