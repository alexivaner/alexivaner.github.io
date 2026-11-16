import data from '../content/portfolio.json';
import work from '../content/work.json';
// Use only the owner's existing descriptions; project-specific implementation claims are absent.
export const websiteCases=data.websites.map(site=>site.id==='kita'?work.kita:{
  id:`website-${site.id}`,name:site.name,headline:site.description,
  image:site.image,imageWidth:1200,imageHeight:833,
  imageAlt:`${site.name}, a real capture of the website.`,
  caption:site.captureNote||`${site.name}, a real capture of the website.`,
  metadata:[{label:'Project type',value:site.type}],
  story:[{title:'The project',text:site.description},{title:'My contribution',text:'Website development'}],
  href:site.href,link:'Visit website'
});
