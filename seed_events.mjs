import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://eoufiwxmxxhxkxzcswyz.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvdWZpd3hteHhoeGt4emNzd3l6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzY0MDg3MSwiZXhwIjoyMDg5MjE2ODcxfQ.VUb5eQ8RsCj2aUYND-5b5YOGAkDS5xfJVqMflfX-ptQ';

const sourceDir = 'C:\\Users\\Prasanna Dantuluri\\.gemini\\antigravity\\brain\\89993520-7b25-4111-a427-9cbcaa857d37';
const destDir = 'C:\\columbusapp\\public\\images\\events';

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Ensure the specific files generated are correctly mapped 
const generatedImages = [
  { file: 'columbus_arts_festival_1776434701998.png', fname: 'columbus_arts_festival.png' },
  { file: 'columbus_food_truck_fest_1776434721669.png', fname: 'columbus_food_truck_fest.png' },
  { file: 'jazz_rib_fest_1776434747649.png', fname: 'jazz_rib_fest.png' },
  { file: 'columbus_pride_parade_1776434764791.png', fname: 'columbus_pride_parade.png' }
];

for (let img of generatedImages) {
    const src = path.join(sourceDir, img.file);
    const dest = path.join(destDir, img.fname);
    if (fs.existsSync(src)) {
        console.log(`Copying ${img.file}...`);
        fs.copyFileSync(src, dest);
    } else {
        console.warn(`Source image missing: ${src}`);
    }
}

const events = [
  {
    title: 'Columbus Arts Festival',
    slug: 'columbus-arts-festival-2026',
    event_date: '2026-05-15',
    event_time: '10:00:00',
    location: 'Scioto Mile, Columbus, OH',
    description: 'Join us for the annual Columbus Arts Festival. Featuring over 200 local and national artists, live music, dance performances, and amazing food trucks along the beautiful Scioto Mile riverfront.',
    image_url: '/images/events/columbus_arts_festival.png',
    price: 'Free',
    category: 'Arts & Culture',
    is_featured: true,
    is_active: true
  },
  {
    title: 'Columbus Food Truck Festival',
    slug: 'columbus-food-truck-fest-2026',
    event_date: '2026-05-30',
    event_time: '11:00:00',
    location: 'Scioto Peninsula, Columbus, OH',
    description: 'The best food trucks in Ohio gather for a weekend of amazing eats, live music, and family fun. Grab your friends and come hungry!',
    image_url: '/images/events/columbus_food_truck_fest.png',
    price: 'Free Admission',
    category: 'Food & Drink',
    is_featured: true,
    is_active: true
  },
  {
    title: 'Jazz & Rib Fest',
    slug: 'jazz-and-rib-fest-2026',
    event_date: '2026-06-10',
    event_time: '11:00:00',
    location: 'Scioto Mile, Columbus, OH',
    description: 'Three days of continuous jazz performances accompanied by incredible ribs from top pitmasters across the country. A quintessential summer event in Columbus.',
    image_url: '/images/events/jazz_rib_fest.png',
    price: 'Free Admission',
    category: 'Music & Food',
    is_featured: true,
    is_active: true
  },
  {
    title: 'Columbus Pride Parade',
    slug: 'columbus-pride-parade-2026',
    event_date: '2026-06-20',
    event_time: '10:30:00',
    location: 'Short North & Goodale Park',
    description: 'Celebrate love, diversity, and inclusion at one of the midwest\'s largest Pride parades and festivals. Features live entertainment, vendors, and community organizations.',
    image_url: '/images/events/columbus_pride_parade.png',
    price: 'Free',
    category: 'Community',
    is_featured: true,
    is_active: true
  },
  {
    title: 'Zoombezi Bay Summer Kickoff',
    slug: 'zoombezi-bay-summer-kickoff',
    event_date: '2026-05-25',
    event_time: '10:30:00',
    location: 'Columbus Zoo and Aquarium',
    description: 'Splash into summer at the Zoombezi Bay kickoff event! Enjoy wave pools, extreme water slides, and fun activities for the whole family.',
    image_url: 'https://images.unsplash.com/photo-1582218167822-fa76a0d24e54?q=80&w=800&auto=format&fit=crop',
    price: '$39.99',
    category: 'Family Fun',
    is_featured: false,
    is_active: true
  },
  {
    title: 'Asian Festival',
    slug: 'asian-festival-2026',
    event_date: '2026-05-24',
    event_time: '10:00:00',
    location: 'Franklin Park, Columbus, OH',
    description: 'Experience the rich cultural heritage of Asia with traditional dance, martial arts demonstrations, authentic cuisine, and cultural exhibits from over a dozen Asian countries.',
    image_url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=800&auto=format&fit=crop',
    price: 'Free',
    category: 'Cultural',
    is_featured: true,
    is_active: true
  },
  {
    title: 'Creekside Blues & Jazz Festival',
    slug: 'creekside-blues-jazz-festival',
    event_date: '2026-06-18',
    event_time: '16:00:00',
    location: 'Gahanna, OH',
    description: 'Enjoy world-class blues and jazz set against the picturesque backdrop of Gahanna\'s Creekside Park. Regional food vendors, artisanal crafts, and multiple stages of entertainment.',
    image_url: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop',
    price: '$15.00',
    category: 'Music',
    is_featured: false,
    is_active: true
  },
  {
    title: 'Short North Gallery Hop',
    slug: 'short-north-gallery-hop-june',
    event_date: '2026-06-06',
    event_time: '16:00:00',
    location: 'High Street, Short North Arts District',
    description: 'Columbus\' favorite tradition. Galleries open their doors to feature new exhibitions, while street performers and vendors line High Street for a vibrant evening of arts and culture.',
    image_url: 'https://images.unsplash.com/photo-1518998053901-537464fe4150?q=80&w=800&auto=format&fit=crop',
    price: 'Free',
    category: 'Arts & Culture',
    is_featured: false,
    is_active: true
  },
  {
    title: 'Easton Summer Concert Series',
    slug: 'easton-summer-concert-series',
    event_date: '2026-06-12',
    event_time: '19:00:00',
    location: 'Easton Town Square',
    description: 'Bring a blanket and relax on the town square while enjoying local and regional touring bands perform. A perfect relaxed summer evening out.',
    image_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=800&auto=format&fit=crop',
    price: 'Free',
    category: 'Music',
    is_featured: false,
    is_active: true
  },
  {
    title: 'Buckeye Country Superfest',
    slug: 'buckeye-country-superfest',
    event_date: '2026-06-27',
    event_time: '15:00:00',
    location: 'Ohio Stadium',
    description: 'The biggest stars in country music take over the Horseshoe for an unforgettable day and night of mega-hits, tailgating, and country pride.',
    image_url: 'https://images.unsplash.com/photo-1541532713592-79a0317b6b77?q=80&w=800&auto=format&fit=crop',
    price: 'From $85',
    category: 'Music',
    is_featured: true,
    is_active: true
  }
];

async function seed() {
    console.log('Inserting events...');
    for (let eq of events) {
        // Upsert by slug (to prevent duplicates if the script is run multiple times)
        // Wait, supabase REST API upsert needs to know the conflict column. 
        // We'll just do an insert with onConflict slug.
        const res = await fetch(`${supabaseUrl}/rest/v1/events?on_conflict=slug`, {
            method: 'POST',
            headers: {
                'apikey': serviceKey,
                'Authorization': `Bearer ${serviceKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify(eq)
        });
        
        if (!res.ok) {
            console.error(`Failed to insert ${eq.slug}:`, await res.text());
        } else {
            console.log(`Successfully inserted ${eq.slug}`);
        }
    }
    console.log('Done!');
}

seed().catch(console.error);
