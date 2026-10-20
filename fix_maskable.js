const sharp = require('sharp');
const path = require('path');
const pub = path.join(process.cwd(), 'public');
const src = path.join(pub, 'logo.png');
async function run(){
  const buf = await sharp(src).png().toBuffer();
  for(const s of [192,512]){
    const logoSize = Math.round(s * 0.6); // more padding for safe zone
    const logo = await sharp(buf).resize(logoSize, logoSize).png().toBuffer();
    await sharp({
      create: { width: s, height: s, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
    }).composite([{ input: logo, left: Math.round((s - logoSize)/2), top: Math.round((s - logoSize)/2) }])
      .png()
      .toFile(path.join(pub, 'icon-maskable-' + s + '.png'));
  }
  console.log('done');
}
run().catch(e=>{console.error(e.message);process.exit(1);});
