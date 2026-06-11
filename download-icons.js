const fs = require('fs');
const https = require('https');

const iconsToFetch = [
  // Marketing
  'search', 'trending-up', 'target', 'bar-chart', 'magnet', 'mail', 'refresh-cw', 'repeat', 'clipboard-list',
  // Web Dev
  'code', 'triangle', 'file-json', 'layout', 'plug', 'zap', 'shield', 'cloud', 'monitor',
  // App Dev
  'smartphone', 'bot', 'smartphone-charging', 'sparkles', 'link', 'check-circle', 'rocket', 'wrench', 'battery-charging',
  // Branding
  'pen-tool', 'smile', 'map', 'book-open', 'package', 'crosshair', 'type', 'microscope', 'message-circle',
  // Video
  'film', 'scissors', 'aperture', 'video', 'image', 'palette', 'tv', 'headphones', 'send',
  // AI
  'message-square', 'brain', 'settings', 'git-branch', 'network', 'activity', 'pie-chart', 'life-buoy', 'database'
];

async function fetchIcon(name) {
  return new Promise((resolve, reject) => {
    https.get(`https://unpkg.com/lucide-static@0.400.0/icons/${name}.svg`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({name, data}));
    }).on('error', reject);
  });
}

async function main() {
  const results = {};
  for (const name of iconsToFetch) {
    try {
      const res = await fetchIcon(name);
      results[name] = res.data;
      console.log(`Fetched ${name}`);
    } catch (e) {
      console.error(`Failed ${name}`);
    }
  }
  
  const fileContent = `export const ICONS: Record<string, string> = ${JSON.stringify(results, null, 2)};`;
  fs.writeFileSync('src/lib/icons.ts', fileContent);
  console.log('Saved to src/lib/icons.ts');
}

main();
