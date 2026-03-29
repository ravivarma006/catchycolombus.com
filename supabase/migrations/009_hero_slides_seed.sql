-- ============================================================
-- Seed: Hero Slides + Stats (matches original hardcoded data)
-- ============================================================

INSERT INTO hero_slides (image_url, thumb_url, location, tag, headline, subtitle, overlay_from, overlay_to, is_active, display_order) VALUES
(
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70&auto=format&fit=crop',
  'Downtown Columbus',
  'City Skyline',
  ARRAY['Discover', 'the Heart of', 'Columbus'],
  'Events, services, and hidden gems in the city you love.',
  'rgba(0,20,50,0.48)',
  'rgba(0,20,50,0.50)',
  true, 0
),
(
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&q=70&auto=format&fit=crop',
  'Short North',
  'Arts & Culture',
  ARRAY['Arts, Culture', '& Vibrant', 'Nightlife'],
  'Columbus''s most electrifying arts district — galleries, food, and music.',
  'rgba(10,8,30,0.48)',
  'rgba(10,8,30,0.50)',
  true, 1
),
(
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=1800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=400&q=70&auto=format&fit=crop',
  'Ohio State University',
  'Campus Life',
  ARRAY['Pride of the', 'Buckeye', 'State'],
  'Campus energy meets city culture — sports, traditions, and innovation.',
  'rgba(12,0,0,0.48)',
  'rgba(12,0,0,0.50)',
  true, 2
),
(
  'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=1800&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400&q=70&auto=format&fit=crop',
  'Scioto Mile',
  'Outdoors',
  ARRAY['Nature', 'Meets the', 'City'],
  'World-class parks and waterways woven into the heart of downtown.',
  'rgba(0,16,10,0.48)',
  'rgba(0,16,10,0.50)',
  true, 3
);

INSERT INTO hero_stats (value, label, display_order, is_active) VALUES
('900K+',  'Residents',        0, true),
('200+',   'Events / Year',    1, true),
('50+',    'Neighbourhoods',   2, true),
('#1',     'Fastest Growing',  3, true);
