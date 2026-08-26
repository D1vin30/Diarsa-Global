import { put } from '@vercel/blob';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const [, , filePath, destPath] = process.argv;

if (!filePath) {
  console.error('Usage: npm run upload:video -- <local-file-path> [destination-path]');
  console.error('Example: npm run upload:video -- ~/Videos/road-survey.mp4 videos/ekpoma-iruekpen-road/survey-1.mp4');
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN not set — run via "npm run upload:video" (loads .env.local automatically).');
  process.exit(1);
}

const pathname = destPath || `videos/${basename(filePath)}`;
const file = readFileSync(filePath);

const blob = await put(pathname, file, { access: 'public', addRandomSuffix: false });

console.log(`\nUploaded: ${blob.url}\n`);
console.log('Paste into the project\'s gallery array in src/data/projects.js:');
console.log(`  { src: '${blob.url}', poster: '/projects/<pick-a-still>.jpg', caption: '<caption>' },`);
