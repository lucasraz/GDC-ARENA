-- EVENT COMMENTS TABLE
CREATE TABLE IF NOT EXISTS event_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS POLICIES
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read comments
CREATE POLICY "Public read event comments" ON event_comments 
    FOR SELECT USING (true);

-- Authenticated users can insert comments
CREATE POLICY "Authenticated users can comment on events" ON event_comments
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Authors can delete their own comments
CREATE POLICY "Authors can delete their own comments" ON event_comments
    FOR DELETE USING (auth.uid() = author_id);

-- Authors can update their own comments
CREATE POLICY "Authors can update their own comments" ON event_comments
    FOR UPDATE USING (auth.uid() = author_id);
    
-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_event_comments_updated_at
BEFORE UPDATE ON event_comments
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
