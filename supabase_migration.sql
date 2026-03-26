-- GDC-ARENA COMPLETE DATABASE MIGRATION
-- This script handles Profiles, Auth Triggers, Cronicas and Comments

-- 0. PRE-REQUISITES (Run manually in Supabase Dashboard if needed)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Supabase Auth)
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

-- Enable RLS on Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profile Policies
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON profiles;

CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. AUTH TRIGGER (Auto-create profile on signup)
-- This function will run whenever a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id, 
    LOWER(SPLIT_PART(new.email, '@', 1)), -- Default username from email
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on every signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. CRONICAS TABLE (User-generated context)
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

-- 4. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cronica_id UUID REFERENCES public.cronicas(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. RLS FOR CRONICAS AND COMMENTS
ALTER TABLE public.cronicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Cronicas Policies
DROP POLICY IF EXISTS "Public Read Cronicas" ON cronicas;
DROP POLICY IF EXISTS "Authors Insert Cronicas" ON cronicas;
DROP POLICY IF EXISTS "Authors Update Cronicas" ON cronicas;
DROP POLICY IF EXISTS "Authors Delete Cronicas" ON cronicas;

CREATE POLICY "Public Read Cronicas" ON cronicas FOR SELECT USING (true);
CREATE POLICY "Authors Insert Cronicas" ON cronicas FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors Update Cronicas" ON cronicas FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors Delete Cronicas" ON cronicas FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- Comments Policies
DROP POLICY IF EXISTS "Public Read Comments" ON comments;
DROP POLICY IF EXISTS "Authors Insert Comments" ON comments;
DROP POLICY IF EXISTS "Authors Update Comments" ON comments;
DROP POLICY IF EXISTS "Authors Delete Comments" ON comments;

CREATE POLICY "Public Read Comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Authors Insert Comments" ON comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Authors Update Comments" ON comments FOR UPDATE TO authenticated USING (auth.uid() = author_id);
CREATE POLICY "Authors Delete Comments" ON comments FOR DELETE TO authenticated USING (auth.uid() = author_id);
