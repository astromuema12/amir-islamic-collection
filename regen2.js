const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const src = path.join(process.cwd(), 'public', 'logo.png');
const pub = path.join(process.cwd(), 'public');
async function run(){
  const buf = await sharp(src).png().toBuffer();
  const sizes=[72,96,128,144,152,192,384,512];
  for(const s of sizes){ await sharp(buf).resize(s,s).png().toFile(path.join(pub,'icon-'+s+'.png')); }
  await sharp(buf).resize(180,180).png().toFile(path.join(pub,'apple-touch-icon.png'));
  await sharp(buf).resize(16,16).png().toFile(path.join(pub,'favicon-16.png'));
  await sharp(buf).resize(32,32).png().toFile(path.join(pub,'favicon-32.png'));
  await sharp(buf).resize(48,48).png().toFile(path.join(pub,'favicon-48.png'));
  await sharp(buf).resize(192,192).png().toFile(path.join(pub,'favicon-192.png'));
  const mask=[192,512];
  for(const s of mask){
    const logoSize=Math.round(s*0.7);
    const logo=await sharp(buf).resize(logoSize,logoSize).png().toBuffer();
    await sharp({create:{width:s,height:s,channels:4,background:'#0f766e'}}).composite([{input:logo,left:Math.round((s-logoSize)/2),top:Math.round((s-logoSize)/2)}]).png().toFile(path.join(pub,'icon-maskable-'+s+'.png'));
  }
  try{await sharp(buf).resize(32,32).toFormat('ico').toFile(path.join(pub,'favicon.ico'));}catch(e){await sharp(buf).resize(32,32).png().toFile(path.join(pub,'favicon.ico'));}
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1254 1254"><image href="/logo.png" width="1254" height="1254"/></svg>';
  ['favicon.svg','icon.svg','pwa-icon.svg','apple-icon.svg'].forEach(n=>fs.writeFileSync(path.join(pub,n),svg));
  console.log('done');
}
run().catch(e=>{console.error(e.toString());process.exit(1);});
