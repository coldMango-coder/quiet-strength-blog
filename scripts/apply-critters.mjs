import fs from 'fs';
import path from 'path';
import Critters from 'critters';

async function run() {
  const buildDir = path.resolve(process.cwd(), 'build');
  const htmlPath = path.join(buildDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.error('Critters: build/index.html not found. Run `npm run build` first.');
    process.exit(1);
  }

  const html = fs.readFileSync(htmlPath, 'utf8');

  const critters = new Critters({
    path: buildDir,
    preload: 'swap',
    pruneSource: false,
    inlineFonts: false,
    reduceInlineStyles: true,
    mergeStylesheets: true,
  });

  const out = await critters.process(html);
  fs.writeFileSync(htmlPath, out, 'utf8');
  console.log('✔ Inlined critical CSS and applied print-swap via Critters');
}

run().catch((err) => {
  console.error('Critters error:', err);
  process.exit(1);
});

