const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const src = 'D:/amir-islamic-collection/public/logo.png';
const pub = 'D:/amir-islamic-collection/public';

async function run() {
  const img = sharp(src).png();
  const buf = await img.toBuffer();
  
  // standard sizes
  const sizes = [72,96,128,144,152,192,384,512];
  for (const s of sizes) {
    await sharp(buf).resize(s,s).png().toFile(path.join(pub, icon-.png));
  }
  await sharp(buf).resize(180,180).png().toFile(path.join(pub, 'apple-touch-icon.png'));
  await sharp(buf).resize(16,16).png().toFile(path.join(pub, 'favicon-16.png'));
  await sharp(buf).resize(32,32).png().toFile(path.join(pub, 'favicon-32.png'));
  await sharp(buf).resize(48,48).png().toFile(path.join(pub, 'favicon-48.png'));
  await sharp(buf).resize(192,192).png().toFile(path.join(pub, 'favicon-192.png'));
  
  // maskable
  for (const s of [192,512]) {
    const logoSize = Math.round(s*0.7);
    const logo = await sharp(buf).resize(logoSize,logoSize).png().toBuffer();
    await sharp({
      create: { width:s, height:s, channels:4, background:{r:15,g:118,b:110,a:1} }
    }).composite([{input:logo, left:Math.round((s-logoSize)/2), top:Math.round((s-logoSize)/2)}]).png().toFile(path.join(pub, icon-maskable-.png));
  }
  
  // favicon.ico - just copy 32px as ico via png is not ideal, but browsers accept png as ico sometimes? better use sharp to create
  await sharp(buf).resize(32,32).png().toFile(path.join(pub, 'favicon.ico'));
  
  const svg = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254">\n  <image href="/logo.png" width="1254" height="1254"/>\n</svg>;
  for (const name of ['favicon.svg','icon.svg','pwa-icon.svg','apple-icon.svg']) {
    fs.writeFileSync(path.join(pub, name), svg);
  }
  
  console.log('done');
}
run().catch(e=>{console.error(e);process.exit(1);});
