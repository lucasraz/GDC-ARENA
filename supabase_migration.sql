-- GDC-ARENA COMPLETE DATABASE MIGRATION (IDEMPOTENT)
-- This script handles Profiles, Auth Triggers, Cronicas, Comments, Events and Newsletter

-- 0. PRE-REQUISITES
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id TEXT DEFAULT 'tenant_1',
    username TEXT UNIQUE,
    full_name TEXT,
    birth_date DATE,
    whatsapp TEXT,
    avatar_url TEXT,
    membership_type TEXT DEFAULT 'nenhum',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clean and recreate Profile Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. AUTH TRIGGER (Auto-create profile on signup)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id, 
    LOWER(SPLIT_PART(new.email, '@', 1)), 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. CRONICAS TABLE
CREATE TABLE IF NOT EXISTS public.cronicas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tenant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    tenant_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    event_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price DECIMAL(10,2) DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. COMMENTS TABLE (Multi-purpose)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cronica_id UUID REFERENCES public.cronicas(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE, 
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. EVENT ATTENDEES (Presence tracking)
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, user_id)
);

-- 7. NEWSLETTER SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    tenant_id TEXT DEFAULT 'tenant_1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. RLS POLICIES (Idempotent with DROP)
ALTER TABLE public.cronicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Cronicas
DROP POLICY IF EXISTS "Public Read Cronicas" ON cronicas;
DROP POLICY IF EXISTS "Authors Insert Cronicas" ON cronicas;
DROP POLICY IF EXISTS "Authors Update Cronicas" ON cronicas;
DROP POLICY IF EXISTS "Authors Delete Cronicas" ON cronicas;
CREATE POLICY "Public Read Cronicas" ON cronicas FOR SELECT USING (true);
CREATE POLICY "Authors Insert Cronicas" ON cronicas FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors Update Cronicas" ON cronicas FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors Delete Cronicas" ON cronicas FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Comments
DROP POLICY IF EXISTS "Public Read Comments" ON comments;
DROP POLICY IF EXISTS "Authors Insert Comments" ON comments;
DROP POLICY IF EXISTS "Authors Delete Comments" ON comments;
CREATE POLICY "Public Read Comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Authors Insert Comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors Delete Comments" ON comments FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Events
DROP POLICY IF EXISTS "Public Read Events" ON events;
DROP POLICY IF EXISTS "Authenticated Insert Events" ON events;
DROP POLICY IF EXISTS "Authors Update Events" ON events;
DROP POLICY IF EXISTS "Authors Delete Events" ON events;
CREATE POLICY "Public Read Events" ON events FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert Events" ON events FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors Update Events" ON events FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors Delete Events" ON events FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Attendance (RSVP)
DROP POLICY IF EXISTS "Public Read Attendance" ON event_attendees;
DROP POLICY IF EXISTS "Authenticated Insert Attendance" ON event_attendees;
DROP POLICY IF EXISTS "Users can delete own attendance" ON event_attendees;
CREATE POLICY "Public Read Attendance" ON event_attendees FOR SELECT USING (true);
CREATE POLICY "Authenticated Insert Attendance" ON event_attendees FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own attendance" ON event_attendees FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Newsletter
DROP POLICY IF EXISTS "Enable insert for all users" ON public.newsletter_subscriptions;
DROP POLICY IF EXISTS "Service role can read" ON public.newsletter_subscriptions;
CREATE POLICY "Enable insert for all users" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role can read" ON public.newsletter_subscriptions FOR SELECT USING (true);
