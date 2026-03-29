-- ============================================================
-- Catch Columbus — Things to Do Seed Data
-- Real Columbus, Ohio attractions & activities
-- ============================================================

-- ─────────────────────────────────────────
-- ACTIVITY CATEGORIES
-- ─────────────────────────────────────────
INSERT INTO activity_categories (name, slug, icon, description, display_order) VALUES
  ('Attractions',         'attractions',         '🎡', 'Must-see attractions and iconic landmarks in Columbus',    1),
  ('Museums',             'museums',             '🏛️', 'World-class museums, galleries, and cultural institutions', 2),
  ('Parks & Nature',      'parks-nature',        '🌳', 'Beautiful parks, trails, and outdoor green spaces',         3),
  ('Shopping',            'shopping',            '🛍️', 'Shopping districts, malls, and unique local boutiques',     4),
  ('Nightlife',           'nightlife',           '🌃', 'Bars, clubs, live music, and late-night entertainment',     5),
  ('Tours',               'tours',               '🗺️', 'Guided tours, food walks, and unique experiences',          6),
  ('Sports',              'sports',              '🏟️', 'Professional and collegiate sports venues and events',      7),
  ('Outdoor Adventures',  'outdoor-adventures',  '🚴', 'Hiking, biking, kayaking, and outdoor recreation',          8)
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Attractions
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'attractions'),
    'Columbus Zoo and Aquarium',
    'columbus-zoo-and-aquarium',
    'One of the top-rated zoos in the nation featuring over 10,000 animals across multiple regions and habitats. Home to the famous Jack Hanna legacy, the zoo offers thrilling rides at Zoombezi Bay water park, seasonal light shows, and conservation programs that protect wildlife worldwide.',
    '4850 W Powell Rd, Powell, OH 43065',
    'Powell',
    'https://www.columbuszoo.org',
    '$$',
    'Daily 9:00 AM – 5:00 PM (seasonal hours vary)',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'attractions'),
    'COSI - Center of Science and Industry',
    'cosi-center-of-science-and-industry',
    'Award-winning science center ranked among the best in the nation. Features interactive exhibits on space, energy, life sciences, and more. Includes a planetarium, giant screen theater, outdoor science park, and engaging programs for all ages.',
    '333 W Broad St, Columbus, OH 43215',
    'Downtown',
    'https://cosi.org',
    '$$',
    'Wed–Sun 10:00 AM – 5:00 PM',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'attractions'),
    'Franklin Park Conservatory and Botanical Gardens',
    'franklin-park-conservatory',
    'A stunning botanical garden and conservatory featuring exotic plant collections from around the world, breathtaking Chihuly glass art installations, seasonal light shows, and community gardens. A perfect blend of art, nature, and education.',
    '1777 E Broad St, Columbus, OH 43203',
    'East Side',
    'https://www.fpconservatory.org',
    '$$',
    'Daily 10:00 AM – 5:00 PM',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Museums
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'museums'),
    'Columbus Museum of Art',
    'columbus-museum-of-art',
    'A premier fine art museum with collections spanning European and American art from 1850 to today. The innovative Wonder Room encourages creativity for visitors of all ages. Features rotating exhibitions, sculpture garden, and community events.',
    '480 E Broad St, Columbus, OH 43215',
    'Downtown',
    'https://www.columbusmuseum.org',
    '$',
    'Tue–Sun 10:00 AM – 5:00 PM, Thu until 9:00 PM',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'museums'),
    'National Veterans Memorial and Museum',
    'national-veterans-memorial-and-museum',
    'The only museum in America honoring all branches of the US armed forces through powerful, immersive exhibits and personal narratives. The striking architecture sits along the Scioto River with panoramic downtown views.',
    '300 W Broad St, Columbus, OH 43215',
    'Downtown',
    'https://www.nationalvmm.org',
    '$$',
    'Wed–Sun 10:00 AM – 5:00 PM',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Parks & Nature
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'parks-nature'),
    'Scioto Mile and Scioto Audubon Metro Park',
    'scioto-mile',
    'A stunning urban riverfront park along the Scioto River in downtown Columbus. Features interactive fountains, paved trails, the Scioto Greenways, and breathtaking skyline views. The adjacent Scioto Audubon park adds climbing walls, wetlands, and birding trails.',
    'W Broad St & Civic Center Dr, Columbus, OH 43215',
    'Downtown',
    'https://www.sciotomile.com',
    'Free',
    'Open daily, dawn to dusk',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'parks-nature'),
    'Highbanks Metro Park',
    'highbanks-metro-park',
    'Over 1,100 acres of forests, prairies, wetlands, and scenic bluffs along the Olentangy River. Offers extensive hiking and mountain biking trails, nature center, sledding hills, and Native American earthworks. A favorite for trail running and wildlife watching.',
    '9466 Columbus Pike, Lewis Center, OH 43035',
    'Lewis Center',
    'https://www.metroparks.net/parks-trails/highbanks',
    'Free',
    'Open daily 6:30 AM – 10:00 PM',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Shopping
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'shopping'),
    'Easton Town Center',
    'easton-town-center',
    'Columbus''s premier open-air lifestyle center with over 200 stores, restaurants, and entertainment venues. From luxury brands to popular retailers, plus a movie theater, comedy club, and seasonal events that make it a year-round destination.',
    '160 Easton Town Center, Columbus, OH 43219',
    'Easton',
    'https://www.eastontowncenter.com',
    'Free',
    'Mon–Sat 10:00 AM – 9:00 PM, Sun 11:00 AM – 6:00 PM',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'shopping'),
    'Short North Arts District',
    'short-north-arts-district',
    'One of Columbus''s most vibrant neighborhoods, known for its eclectic galleries, independent boutiques, chef-driven restaurants, and the famous monthly Gallery Hop. The arches over High Street are an iconic Columbus landmark.',
    'N High St, Columbus, OH 43215',
    'Short North',
    'https://www.shortnorth.com',
    'Free',
    'Varies by shop — most open 10 AM – 8 PM',
    true
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Nightlife
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'nightlife'),
    'Arena District',
    'arena-district',
    'Columbus''s premier entertainment hub centered around Nationwide Arena. Packed with sports bars, craft cocktail lounges, live music venues, and rooftop patios. The energy here peaks on game nights and weekends.',
    'Arena District, Columbus, OH 43215',
    'Arena District',
    'https://www.arenadistrict.com',
    '$–$$$',
    'Varies by venue — most open until 2 AM',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Sports
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'sports'),
    'Ohio Stadium — The Horseshoe',
    'ohio-stadium',
    'The legendary Horseshoe, home to Ohio State Buckeyes football. With over 100,000 seats, it''s one of the largest stadiums in the nation. Game days transform Columbus into a sea of scarlet and gray with unmatched energy and tradition.',
    '411 Woody Hayes Dr, Columbus, OH 43210',
    'University District',
    'https://ohiostatebuckeyes.com/venues/ohio-stadium/',
    '$$$',
    'Event days only — gates open 2 hours before kickoff',
    true
  ),
  (
    (SELECT id FROM activity_categories WHERE slug = 'sports'),
    'Lower.com Field',
    'lower-com-field',
    'State-of-the-art home of the Columbus Crew, 2023 MLS Cup champions. Located in the Arena District, the stadium delivers an electric atmosphere for soccer fans with stunning downtown views and a thriving tailgate scene.',
    '96 Columbus Crew Way, Columbus, OH 43215',
    'Arena District',
    'https://www.columbuscrew.com',
    '$$',
    'Match days and event days',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Tours
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'tours'),
    'Columbus Food Adventures',
    'columbus-food-adventures',
    'Walking food tours that take you behind the scenes of Columbus''s diverse culinary scene. Explore neighborhoods like the Short North, North Market, and more while sampling dishes from chef-owned restaurants and hidden gems.',
    'Various locations, Columbus, OH',
    'Various',
    'https://www.columbusfoodadventures.com',
    '$$',
    'Tours run Sat & Sun — check website for schedule',
    false
  )
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- ACTIVITIES — Outdoor Adventures
-- ─────────────────────────────────────────
INSERT INTO activities (category_id, name, slug, description, address, neighborhood, website, price_range, hours, is_featured) VALUES
  (
    (SELECT id FROM activity_categories WHERE slug = 'outdoor-adventures'),
    'Olentangy Trail',
    'olentangy-trail',
    'A scenic 13.5-mile paved multi-use trail following the Olentangy River through the heart of Columbus. Perfect for biking, running, and walking, the trail connects parks, neighborhoods, and the Ohio State campus with beautiful river views.',
    'Olentangy River Rd, Columbus, OH',
    'Various',
    'https://www.metroparks.net/parks-trails/greenways/olentangy-trail/',
    'Free',
    'Open daily, dawn to dusk',
    false
  )
ON CONFLICT (slug) DO NOTHING;
