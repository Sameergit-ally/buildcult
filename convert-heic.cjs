const convert = require('heic-convert');
const fs = require('fs');
const path = require('path');

const base = process.cwd();
const heics = ['IMG_9629.HEIC','IMG_9630.HEIC','IMG_9653.HEIC','IMG_9655.HEIC','IMG_9668.HEIC'];

async function run() {
  for (let i = 0; i < heics.length; i++) {
    const inputPath = path.join(base, 'pictures', heics[i]);
    const outputPath = path.join(base, 'public', `hackathon-${i+5}.jpg`);
    console.log(`Converting ${heics[i]}...`);
    try {
      const inputBuffer = fs.readFileSync(inputPath);
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 0.85,
      });
      fs.writeFileSync(outputPath, Buffer.from(outputBuffer));
      console.log(`  -> ${outputPath}`);
    } catch (err) {
      console.error(`  Error: ${err.message}`);
    }
  }
  console.log('Done!');
}

run();

