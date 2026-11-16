import puppeteer from 'puppeteer-core';
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
try {
 const page=await browser.newPage();
 await page.evaluateOnNewDocument(()=>localStorage.setItem('ivan-language','en'));
 await page.goto((process.env.PORTFOLIO_URL||'http://127.0.0.1:4175')+'/resume/',{waitUntil:'networkidle0'});
 await page.evaluate(()=>document.fonts.ready);
 await page.pdf({path:'public/assets/ivan-surya-hutomo-resume.pdf',format:'A4',printBackground:true,preferCSSPageSize:true});
 console.log('Exported the complete English resume to public/assets/ivan-surya-hutomo-resume.pdf');
}finally{await browser.close();}
