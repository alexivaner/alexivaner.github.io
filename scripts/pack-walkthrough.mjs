import {readFile,writeFile,mkdir,chmod} from 'node:fs/promises';
import {randomBytes} from 'node:crypto';
import {encryptWalkthrough} from '../src/protected/crypto.js';
await mkdir('.private-review',{recursive:true});await mkdir('public/assets/protected',{recursive:true});
const path='.private-review/presenter-passphrase.txt';let passcode;
try{passcode=await readFile(path,'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
if(!passcode||process.argv.includes('--rotate')){passcode=randomBytes(24).toString('base64url');await writeFile(path,passcode+'\n',{mode:0o600});}
await chmod(path,0o600);
const content=JSON.parse(await readFile('.private-review/engineering-walkthrough.json','utf8'));
const packet=await encryptWalkthrough(content,passcode);
await writeFile('public/assets/protected/engineering.enc.json',JSON.stringify(packet)+'\n');
console.log('Packed the encrypted engineering walkthrough. Its passphrase remains in the ignored local presenter file.');
