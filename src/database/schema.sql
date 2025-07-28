-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  plan_type TEXT NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create niches table
CREATE TABLE public.niches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  search_volume INTEGER DEFAULT 0,
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  monetization_potential INTEGER DEFAULT 0 CHECK (monetization_potential >= 0 AND monetization_potential <= 100),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create keywords table
CREATE TABLE public.keywords (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  search_volume INTEGER DEFAULT 0,
  competition_level TEXT CHECK (competition_level IN ('low', 'medium', 'high')),
  cpc_value DECIMAL(10,2) DEFAULT 0.00,
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create niche_sites table
CREATE TABLE public.niche_sites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  monetization_method TEXT,
  revenue DECIMAL(10,2) DEFAULT 0.00,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create content table
CREATE TABLE public.content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  image_url TEXT,
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  niche_id UUID REFERENCES public.niches(id) ON DELETE CASCADE,
  niche_site_id UUID REFERENCES public.niche_sites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.niche_sites ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for niches table
CREATE POLICY "Users can view own niches" ON public.niches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own niches" ON public.niches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own niches" ON public.niches
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own niches" ON public.niches
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for keywords table
CREATE POLICY "Users can view keywords for own niches" ON public.keywords
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.niches 
      WHERE niches.id = keywords.niche_id 
      AND niches.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert keywords for own niches" ON public.keywords
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.niches 
      WHERE niches.id = keywords.niche_id 
      AND niches.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update keywords for own niches" ON public.keywords
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.niches 
      WHERE niches.id = keywords.niche_id 
      AND niches.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete keywords for own niches" ON public.keywords
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.niches 
      WHERE niches.id = keywords.niche_id 
      AND niches.user_id = auth.uid()
    )
  );

-- Create RLS policies for niche_sites table
CREATE POLICY "Users can view own niche sites" ON public.niche_sites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own niche sites" ON public.niche_sites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own niche sites" ON public.niche_sites
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own niche sites" ON public.niche_sites
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for content table
CREATE POLICY "Users can view content for own niches/sites" ON public.content
  FOR SELECT USING (
    (niche_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.niches 
      WHERE niches.id = content.niche_id 
      AND niches.user_id = auth.uid()
    )) OR
    (niche_site_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.niche_sites 
      WHERE niche_sites.id = content.niche_site_id 
      AND niche_sites.user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can insert content for own niches/sites" ON public.content
  FOR INSERT WITH CHECK (
    (niche_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.niches 
      WHERE niches.id = content.niche_id 
      AND niches.user_id = auth.uid()
    )) OR
    (niche_site_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.niche_sites 
      WHERE niche_sites.id = content.niche_site_id 
      AND niche_sites.user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can update content for own niches/sites" ON public.content
  FOR UPDATE USING (
    (niche_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.niches 
      WHERE niches.id = content.niche_id 
      AND niches.user_id = auth.uid()
    )) OR
    (niche_site_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.niche_sites 
      WHERE niche_sites.id = content.niche_site_id 
      AND niche_sites.user_id = auth.uid()
    ))
  );

CREATE POLICY "Users can delete content for own niches/sites" ON public.content
  FOR DELETE USING (
    (niche_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.niches 
      WHERE niches.id = content.niche_id 
      AND niches.user_id = auth.uid()
    )) OR
    (niche_site_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM public.niche_sites 
      WHERE niche_sites.id = content.niche_site_id 
      AND niche_sites.user_id = auth.uid()
    ))
  );

-- Create indexes for better performance
CREATE INDEX idx_niches_user_id ON public.niches(user_id);
CREATE INDEX idx_keywords_niche_id ON public.keywords(niche_id);
CREATE INDEX idx_content_niche_id ON public.content(niche_id);
CREATE INDEX idx_content_niche_site_id ON public.content(niche_site_id);
CREATE INDEX idx_niche_sites_user_id ON public.niche_sites(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_niches_updated_at BEFORE UPDATE ON public.niches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_keywords_updated_at BEFORE UPDATE ON public.keywords
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON public.content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_niche_sites_updated_at BEFORE UPDATE ON public.niche_sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

