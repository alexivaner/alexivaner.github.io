import {readdir,readFile,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
async function files(dir){const all=[];for(const name of await readdir(dir)){const path=`${dir}/${name}`;(await stat(path)).isDirectory()?all.push(...await files(path)):all.push(path);}return all;}
const built=await files('dist');
assert(!built.some(p=>/\.private-review|\.hallmark|portfolio-confidentiality-audit|Contract_Ivan|Company_Policies|employment-case-draft/.test(p)),'Private review material in deployment');
assert.deepEqual(built.filter(p=>p.endsWith('.pdf')),['dist/assets/ivan-surya-hutomo-resume.pdf']);
for(const path of [...await files('src'),...await files('content'),...built.filter(p=>/\.(html|json|js)$/.test(p)&&!/(?:bundle|\/line\/|\/simplereact\/|\/usandb\/)/.test(p))]){
 const text=await readFile(path,'utf8');
 assert(!/xview-studio\.webp|venus3d|nobbytech|Contract_Ivan|Company_Policies_Bilingual|employment-case-draft-before-publication/i.test(text),`Unapproved reference: ${path}`);
}
assert((await readFile('dist/assets/ivan-surya-hutomo-resume.pdf')).subarray(0,5).toString()==='%PDF-');
console.log('Release boundaries passed: private documents and review drafts excluded; only the intended resume PDF is public.');

const motion=JSON.parse(await readFile('dist/assets/media/golf-body-motion.json','utf8'));
assert.deepEqual(Object.keys(motion).sort(),['format','frames'],'Only approved body coordinates may be exported');
assert.equal(motion.format,'body17-normalized-v1');
assert(motion.frames.length>1&&motion.frames.length<=1000&&motion.frames.every(f=>Array.isArray(f)&&f.length===17&&f.every(p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite))),'Invalid body-only motion export');

const protectedDocument=JSON.parse(await readFile('dist/assets/protected/engineering.enc.json','utf8'));
assert.deepEqual(Object.keys(protectedDocument).sort(),['algorithm','ciphertext','iterations','iv','kdf','salt','version']);
assert.equal(protectedDocument.version,1);assert.equal(protectedDocument.algorithm,'AES-GCM');assert.equal(protectedDocument.kdf,'PBKDF2-SHA256');assert.equal(protectedDocument.iterations,600000);
assert.equal(Buffer.from(protectedDocument.salt,'base64').length,16);assert.equal(Buffer.from(protectedDocument.iv,'base64').length,12);assert(Buffer.from(protectedDocument.ciphertext,'base64').length>128);
assert(!built.some(p=>/passphrase|engineering-walkthrough\.json|character\.fbx/i.test(p)),'Private source or original model in deployment');
const model=await readFile('dist/assets/models/portfolio-character.glb');assert.equal(model.subarray(0,4).toString(),'glTF');assert.equal(model.readUInt32LE(4),2);
const gltf=JSON.parse(model.subarray(20,20+model.readUInt32LE(12)).toString());assert(gltf.skins?.length>0);assert(!(gltf.buffers||[]).some(b=>b.uri));assert(!(gltf.images||[]).some(i=>i.uri),'Avatar must not request external textures');
console.log('Motion, embedded avatar, and encrypted walkthrough boundaries passed.');

const headMotion=JSON.parse(await readFile('dist/assets/media/golf-head-motion.json','utf8'));
assert.deepEqual(Object.keys(headMotion).sort(),['format','frames']);assert.equal(headMotion.format,'head-directions-v1');assert.equal(headMotion.frames.length,motion.frames.length);
for(const frame of headMotion.frames){assert.deepEqual(Object.keys(frame).sort(),['neck','right','up']);for(const key of ['neck','up','right'])assert(frame[key].length===3&&frame[key].every(Number.isFinite)&&Math.abs(Math.hypot(...frame[key])-1)<.001,'Only normalized head/neck directions may be exported');}
const club=JSON.parse(await readFile('dist/assets/media/golf-club-motion.json','utf8'));
assert.deepEqual(Object.keys(club).sort(),['format','frames']);assert.equal(club.format,'club-pose-v1');assert.equal(club.frames.length,motion.frames.length);
for(const frame of club.frames){assert.deepEqual(Object.keys(frame).sort(),['grip','head','heel']);for(const point of Object.values(frame))assert(point.length===3&&point.every(Number.isFinite));}
assert(!built.some(p=>/product-captures|xview-studio\.jpg|demo-review\.jpg|demo-3d\.jpg/.test(p)),'Product screenshots must remain encrypted');
for(const theme of ['light','dark'])assert((await stat(`dist/assets/images/motion/avatar-${theme}.webp`)).size>1000);
