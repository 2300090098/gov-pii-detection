import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SYNTHETIC_SAMPLES } from '../services/syntheticSamples.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const samplesDir = path.join(__dirname, 'sample_files');

if (!fs.existsSync(samplesDir)) {
  fs.mkdirSync(samplesDir, { recursive: true });
}

SYNTHETIC_SAMPLES.forEach((sample) => {
  const filePath = path.join(samplesDir, `${sample.id}.txt`);
  fs.writeFileSync(filePath, sample.text, 'utf-8');
  console.log(`✓ Created test document: ${sample.id}.txt`);
});
