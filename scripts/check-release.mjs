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
