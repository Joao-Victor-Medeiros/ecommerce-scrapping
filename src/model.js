const puppeteer = require('puppeteer');


const URL = `https://www.magazineluiza.com.br/busca/geladeira/?page=1`;

async function scrapeProducts() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL);

    const productList = await page.$$('[data-testid="product-list"]');
    const productData = [];

    for (const product of productList) {
        await product.click();
        await page.waitForSelector('.sc-fqkvVR.dUvaSJ.sc-ezreuY.fICHEO');

        const productInfo = await page.evaluate(() => {
            const title = document.querySelector('table.sc-fqkvVR > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2)').innerText;
            // Add more properties as needed
            return {
                title,
            };
        });

        productData.push(productInfo);
    }

    await browser.close();

    console.log(productData);
}

scrapeProducts();