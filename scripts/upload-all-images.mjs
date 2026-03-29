/**
 * Upload all static images from public/ to Supabase Storage buckets.
 *
 * Usage: node scripts/upload-all-images.mjs
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY from .env.local
 */
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

// Define upload mappings: [localFolder, bucket, storagePrefix]
const UPLOAD_GROUPS = [
  { localFolder: "categories", bucket: "categories", storagePrefix: "home-categories" },
  { localFolder: "services",   bucket: "categories", storagePrefix: "services" },
  { localFolder: "events",     bucket: "event-images", storagePrefix: "fallbacks" },
];

async function uploadGroup({ localFolder, bucket, storagePrefix }) {
  const folderPath = path.join(PUBLIC_DIR, localFolder);
  if (!fs.existsSync(folderPath)) {
    console.log(`  Skipping ${localFolder}/ (folder not found)`);
    return;
  }

  const files = fs.readdirSync(folderPath).filter((f) =>
    /\.(png|jpe?g|webp)$/i.test(f)
  );

  console.log(`\n  ${localFolder}/ -> bucket "${bucket}" prefix "${storagePrefix}" (${files.length} files)`);

  for (const fileName of files) {
    const filePath = path.join(folderPath, fileName);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(fileName).toLowerCase().replace(".", "");
    const contentType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
    const storagePath = `${storagePrefix}/${fileName}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, fileBuffer, { contentType, upsert: true });

    if (error) {
      console.error(`    FAIL ${storagePath}: ${error.message}`);
    } else {
      const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      console.log(`    OK   ${storagePath} -> ${data.publicUrl}`);
    }
  }
}

async function main() {
  console.log("Uploading static images to Supabase Storage...\n");

  for (const group of UPLOAD_GROUPS) {
    await uploadGroup(group);
  }

  console.log("\nDone!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
