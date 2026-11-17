const textFields=new Set(['title','summary','text','label','center','alt','caption','owner','description','legend','layer','example']);
// Localize only from the decrypted payload. Protected phrases never enter public catalogs.
export function localizeWalkthrough(content,locale){
 const messages=content.translations?.[locale]||{};
 function visit(value,key){
  if(typeof value==='string')return textFields.has(key)&&Object.hasOwn(messages,value)&&typeof messages[value]==='string'?messages[value]:value;
  if(Array.isArray(value))return value.map(item=>visit(item,key));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).filter(([name])=>name!=='translations').map(([name,item])=>[name,visit(item,name)]));
  return value;
 }
 return {...visit(content),language:locale==='en'||content.translations?.[locale]?locale:'en'};
}
