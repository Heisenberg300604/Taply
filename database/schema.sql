-- ============================================
-- 1. Create the 'profiles' table
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  name TEXT,
  bio TEXT,
  avatar_url TEXT,
  links JSONB,
  theme TEXT,
  has_completed_onboarding BOOLEAN DEFAULT false
);

-- ============================================
-- 2. Create the 'scans' table
-- ============================================
CREATE TABLE scans (
  id BIGSERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  city TEXT,
  device TEXT
);

-- ============================================
-- 3. Enable Row Level Security
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. Profiles Policies
-- ============================================

-- Policy: Users can update only their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy: Anyone can read any profile (public read)
CREATE POLICY "Anyone can read profiles"
  ON profiles
  FOR SELECT
  USING (true);

-- ============================================
-- 5. Scans Policies
-- ============================================

-- Block all INSERT attempts from normal users
-- Only the service_role (server-side) can bypass this
CREATE POLICY "Only server can insert scans"
  ON scans
  FOR INSERT
  WITH CHECK (false);


-- Function to create profile automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, null); -- username can be filled later
  return new;
end;
$$ language plpgsql security definer;

-- Trigger that runs after a user is created
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();