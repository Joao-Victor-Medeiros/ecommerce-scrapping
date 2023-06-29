const puppeteer = require('puppeteer');

async function scrapePage(num) {
    if (num <= 0) {
        console.log("done")
        return;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.magazineluiza.com.br/busca/geladeira/?page=1');
    const productItems = await page.$$('[data-testid="product-card-container"]');
    console.log(productItems.length)
    await page.click('a[data-testid="product-card-container"]');

    // Wait for the page to load after the click
    await page.waitForNavigation();

    // Now you are on the new page, and you can scrape the data you need
    const scrapedData = await page.evaluate(() => {

        const title = document.querySelector('h1').textContent;
        const paragraphs = Array.from(document.querySelectorAll('table')).map(t => t.querySelector('tr').textContent);

        return {
            title,
            paragraphs
        };
    });

    await page.goBack();
    console.log('goBack')
    console.log(scrapedData);
    await browser.close();
    await scrapePage(num - 1);
}

scrapePage(50);
