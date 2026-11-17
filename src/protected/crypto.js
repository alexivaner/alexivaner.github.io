const encoder=new TextEncoder(),aad=encoder.encode('ivan-portfolio/engineering/v1');
const iterations=600000;
function encode(bytes){let text='';for(let i=0;i<bytes.length;i+=8192)text+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(text);}
function decode(text){return Uint8Array.from(atob(text),c=>c.charCodeAt(0));}
async function keyFor(passcode,salt,usage){
 const material=await crypto.subtle.importKey('raw',encoder.encode(passcode.trim()),'PBKDF2',false,['deriveKey']);
 return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,[usage]);
}
export async function encryptWalkthrough(content,passcode){
 if(passcode.trim().length<20)throw new Error('Use a strong passphrase of at least 20 characters.');
 const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
 const key=await keyFor(passcode,salt,'encrypt');const ciphertext=await crypto.subtle.encrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},key,encoder.encode(JSON.stringify(content)));
 return {version:1,algorithm:'AES-GCM',kdf:'PBKDF2-SHA256',iterations,salt:encode(salt),iv:encode(iv),ciphertext:encode(new Uint8Array(ciphertext))};
}
export async function decryptWalkthrough(packet,passcode){
 if(packet.version!==1||packet.algorithm!=='AES-GCM'||packet.kdf!=='PBKDF2-SHA256'||packet.iterations!==iterations||typeof packet.ciphertext!=='string'||packet.ciphertext.length>2000000)throw new Error('Unsupported protected document');
 const salt=decode(packet.salt),iv=decode(packet.iv);if(salt.length!==16||iv.length!==12)throw new Error('Invalid protected document');
 const key=await keyFor(passcode,salt,'decrypt');const plain=await crypto.subtle.decrypt({name:'AES-GCM',iv,additionalData:aad,tagLength:128},key,decode(packet.ciphertext));
 const content=JSON.parse(new TextDecoder().decode(plain));
 if(!content||!Array.isArray(content.chapters)||!content.chapters.length||content.chapters.length>20||!content.chapters.every(c=>typeof c.id==='string'&&typeof c.title==='string'&&typeof c.summary==='string'&&Array.isArray(c.sections)&&c.sections.length<=8&&c.sections.every(s=>typeof s.title==='string'&&typeof s.text==='string')))throw new Error('Invalid walkthrough');
 for(const chapter of content.chapters)if(chapter.images&&(!Array.isArray(chapter.images)||chapter.images.length>4||!chapter.images.every(image=>typeof image.src==='string'&&/^data:image\/(jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image.src)&&image.src.length<1000000&&typeof image.alt==='string'&&typeof image.caption==='string'&&/^https:\/\/(?:demo\.)?xview\.ai\//.test(image.href))))throw new Error('Invalid product screens');
 for(const chapter of content.chapters)if(chapter.links&&(!Array.isArray(chapter.links)||chapter.links.length>6||!chapter.links.every(link=>typeof link.label==='string'&&typeof link.href==='string'&&/^https:\/\/(?:demo\.|check\.)?xview\.ai\//.test(link.href))))throw new Error('Invalid references');
 for(const chapter of content.chapters)if(chapter.diagram){
  const diagram=chapter.diagram;
  if(!Array.isArray(diagram.nodes)||!diagram.nodes.length||diagram.nodes.length>12||!diagram.nodes.every(node=>typeof node.id==='string'&&typeof node.title==='string'&&typeof node.text==='string'&&(!node.position||(Array.isArray(node.position)&&node.position.length===2&&node.position.every(n=>Number.isFinite(n)&&n>=0&&n<=100)))))throw new Error('Invalid diagram');
  const ids=new Set(diagram.nodes.map(node=>node.id));
  if(ids.size!==diagram.nodes.length||diagram.edges&&(!Array.isArray(diagram.edges)||diagram.edges.length>40||!diagram.edges.every(edge=>ids.has(edge.from)&&ids.has(edge.to)&&edge.from!==edge.to&&typeof edge.label==='string'&&['dependency','wiring'].includes(edge.kind))))throw new Error('Invalid connections');
 }
 if(content.translations&&(!content.translations||typeof content.translations!=='object'||Array.isArray(content.translations)||!Object.entries(content.translations).every(([locale,messages])=>['id','zh-TW','ko','ja'].includes(locale)&&messages&&typeof messages==='object'&&!Array.isArray(messages)&&Object.keys(messages).length<=500&&Object.entries(messages).every(([key,value])=>typeof value==='string'&&key.length<=12000&&value.length<=12000))))throw new Error('Invalid translations');
 return content;
}
