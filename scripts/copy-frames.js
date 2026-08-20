const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '..', 'frames');
const destDir = path.join(__dirname, '..', 'public', 'sequence');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.webp'));
console.log(`Found ${files.length} frames in ${srcDir}`);

// Sort files to preserve natural index
files.sort((a, b) => {
  const matchA = a.match(/frame_(\d+)/);
  const matchB = b.match(/frame_(\d+)/);
  const numA = matchA ? parseInt(matchA[1], 10) : 0;
  const numB = matchB ? parseInt(matchB[1], 10) : 0;
  return numA - numB;
});

files.forEach((file, index) => {
  const srcPath = path.join(srcDir, file);
  // Format as frame_001.webp through frame_239.webp (and frame_000.webp)
  // Let's create both padded 3-digit frame_001.webp and original frame_000.webp
  const frameNumStr = String(index).padStart(3, '0');
  const destPath = path.join(destDir, `frame_${frameNumStr}.webp`);
  fs.copyFileSync(srcPath, destPath);

  // Also if index >= 1, we ensure frame_001 to frame_239 exists
  const oneIndexedStr = String(index + 1).padStart(3, '0');
  const oneIndexedDestPath = path.join(destDir, `frame_seq_${oneIndexedStr}.webp`);
  fs.copyFileSync(srcPath, oneIndexedDestPath);
});

console.log(`Successfully copied frames to ${destDir}`);
