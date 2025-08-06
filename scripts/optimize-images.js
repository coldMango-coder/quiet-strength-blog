const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceDir = 'public/images';
const supportedFormats = ['.jpg', '.jpeg', '.png'];

async function optimizeImage(imagePath) {
  const ext = path.extname(imagePath).toLowerCase();
  const baseName = path.basename(imagePath, ext);
  const dir = path.dirname(imagePath);
  
  if (!supportedFormats.includes(ext)) {
    return;
  }

  try {
    const webpPath = path.join(dir, `${baseName}.webp`);
    const avifPath = path.join(dir, `${baseName}.avif`);
    
    // Skip if already converted
    if (fs.existsSync(webpPath) && fs.existsSync(avifPath)) {
      return;
    }

    console.log(`Optimizing ${imagePath}...`);
    
    // Get original file size
    const originalStats = fs.statSync(imagePath);
    const originalSize = (originalStats.size / 1024 / 1024).toFixed(2);
    
    // Convert to WebP with 80% quality
    if (!fs.existsSync(webpPath)) {
      await sharp(imagePath)
        .webp({ quality: 80 })
        .toFile(webpPath);
    }
    
    // Convert to AVIF with 70% quality (better compression)
    if (!fs.existsSync(avifPath)) {
      await sharp(imagePath)
        .avif({ quality: 70 })
        .toFile(avifPath);
    }

    const webpStats = fs.statSync(webpPath);
    const avifStats = fs.statSync(avifPath);
    
    const webpSize = (webpStats.size / 1024 / 1024).toFixed(2);
    const avifSize = (avifStats.size / 1024 / 1024).toFixed(2);
    
    console.log(`  Original: ${originalSize}MB → WebP: ${webpSize}MB → AVIF: ${avifSize}MB`);
    
  } catch (error) {
    console.error(`Error optimizing ${imagePath}:`, error.message);
  }
}

async function optimizeAllImages() {
  console.log('Starting image optimization...');
  
  const getAllImages = (dir) => {
    const files = [];
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        files.push(...getAllImages(fullPath));
      } else if (supportedFormats.includes(path.extname(item).toLowerCase())) {
        files.push(fullPath);
      }
    }
    return files;
  };

  const imageFiles = getAllImages(sourceDir);
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  // Process images in batches to avoid memory issues
  const batchSize = 5;
  for (let i = 0; i < imageFiles.length; i += batchSize) {
    const batch = imageFiles.slice(i, i + batchSize);
    await Promise.all(batch.map(optimizeImage));
  }
  
  console.log('Image optimization complete!');
}

optimizeAllImages().catch(console.error);