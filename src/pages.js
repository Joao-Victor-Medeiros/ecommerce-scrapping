const puppeteer = require('puppeteer');


const URL = `https://www.magazineluiza.com.br/busca/geladeira/`;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL, {waitUntil: 'networkidle2'});
    await page.screenshot({path: './print.png', fullPage: true});

    await page.waitForSelector('[data-testid="product-list"]');

    const elements = await page.$$eval('[data-testid="product-card-container"]', (nodes) => {
        const regex = /\b[A-Z]\w*\d\w*\b/;

        return nodes.map((node) => {
            const nameElement = node.querySelector('[data-testid="product-title"]');
            const modelElement = node.querySelector('[data-testid="review"]');
            const priceElement = node.querySelector('[data-testid="price-value"]');

            const name = nameElement ? nameElement.innerText : '';
            const model = modelElement ? modelElement.innerText : '';
            const price = priceElement ? priceElement.innerText : '';

            return name.match(regex)

            // return { name, model, price };
        });
    });

    elements.forEach((element) => {
       console.log(element)
    });


    await browser.close()
})();