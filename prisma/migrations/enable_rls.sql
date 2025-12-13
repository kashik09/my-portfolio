-- Enable Row Level Security (RLS) on all tables
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- ============================================
-- 1. ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 2. PROJECTS - Public read, admin write
-- ============================================

-- Allow anyone to read published projects
CREATE POLICY "Anyone can view published projects"
ON public.projects
FOR SELECT
USING (published = true);

-- Allow admins to do everything
CREATE POLICY "Admins can do everything with projects"
ON public.projects
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'ADMIN'
  )
);

-- ============================================
-- 3. PROJECT REQUESTS - Public write, admin read
-- ============================================

-- Allow anyone to submit a request
CREATE POLICY "Anyone can submit project requests"
ON public.project_requests
FOR INSERT
WITH CHECK (true);

-- Allow users to view their own requests
CREATE POLICY "Users can view their own requests"
ON public.project_requests
FOR SELECT
USING (
  auth.uid() = user_id
  OR email = (SELECT email FROM public.users WHERE id = auth.uid())
);

-- Allow admins to view and manage all requests
CREATE POLICY "Admins can manage all requests"
ON public.project_requests
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'ADMIN'
  )
);

-- ============================================
-- 4. VISITS - Public write, admin read
-- ============================================

-- Allow anyone to log visits
CREATE POLICY "Anyone can log visits"
ON public.visits
FOR INSERT
WITH CHECK (true);

-- Allow admins to view analytics
CREATE POLICY "Admins can view all visits"
ON public.visits
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'ADMIN'
  )
);

-- ============================================
-- 5. USERS - Admin only
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
ON public.users
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Admins can do everything
CREATE POLICY "Admins can manage all users"
ON public.users
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'ADMIN'
  )
);

-- ============================================
-- 6. NEXTAUTH TABLES - Restricted access
-- ============================================

-- Accounts - users can view their own
CREATE POLICY "Users can view their own accounts"
ON public.accounts
FOR SELECT
USING (
  user_id = auth.uid()
);

-- Sessions - users can view their own
CREATE POLICY "Users can view their own sessions"
ON public.sessions
FOR SELECT
USING (
  user_id = auth.uid()
);

-- Verification tokens - admin only
CREATE POLICY "Admins can manage verification tokens"
ON public.verification_tokens
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'ADMIN'
  )
);

-- ============================================
-- 7. SERVICE ROLE BYPASS (for API routes)
-- ============================================

-- These policies allow your API routes (using service role key) to bypass RLS
-- This is needed for NextAuth and other server-side operations

COMMENT ON TABLE public.users IS 'RLS enabled - users can view/update own profile, admins have full access';
COMMENT ON TABLE public.projects IS 'RLS enabled - public read for published, admins have full access';
COMMENT ON TABLE public.project_requests IS 'RLS enabled - public can submit, users see own, admins see all';
COMMENT ON TABLE public.visits IS 'RLS enabled - public can log, admins can view';
