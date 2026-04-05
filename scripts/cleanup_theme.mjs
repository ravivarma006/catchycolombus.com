import fs from 'fs';
import path from 'path';

const APP_DIR = path.join(process.cwd(), 'app');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      if (fullPath.endsWith('.tsx')) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = walk(APP_DIR);
let cleanCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Remove inline style={{ background: "linear-gradient... "}} from container divs
  content = content.replace(/style=\{\{\s*background:\s*(?:"|')linear-gradient[^"']+(?:"|')\s*\}\}/g, '');
  
  // Clean up any empty style={{ }} left behind
  content = content.replace(/style=\{\{\s*\}\}/g, '');
  
  // Clean up any trailing space before > like className="min-h-screen" >
  content = content.replace(/"\s+>/g, '">');

  // 2. Remove ambient orb div blocks entirely.
  // We'll look for `<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">` down to `</div>`
  const blobRegex = /<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">[\s\S]*?<\/div>\s*<\/div>\s*/g;
  // Actually, some inner divs might make matching greedy. Let's just match the specific known blob patterns:
  
  const blobDivPattern = /<div className="fixed inset-0 z-[0-9]+ overflow-hidden pointer-events-none">[\s\S]*?<\/div>(\r?\n)?/g;
  // We have to be careful not to delete sibling content.
  // The outer div is exactly `<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">`
  // It contains multiple `<div className="absolute top-... blur-[130px]" />`
  // And ends with `</div>`
  
  content = content.replace(
    /<div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">\s*(<div className="absolute[^>]+>\s*)*<\/div>/g,
    ''
  );
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    cleanCount++;
    console.log(`Cleaned: ${file.replace(APP_DIR, '')}`);
  }
});

console.log(`\nSuccessfully cleaned ${cleanCount} files!`);
