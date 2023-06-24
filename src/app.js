const puppeteer = require('puppeteer');


const URL = `https://www.magazineluiza.com.br/busca/geladeira/`;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.87 Safari/537.36');
    await page.goto(URL, { waitUntil: 'networkidle2' });
    await page.screenshot({ path: './print.png', fullPage: true });
    const elements= await page.$$('[data-testid="product-title"]')



   for (let element of elements) {
       const value = await page.evaluate(el => el.textContent, element);
       console.log('Valor do elemento:', value);
   }

    console.log(elements.length);
    await browser.close();
})();