const puppeteer = require('puppeteer');

async function scrapeProducts(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);

    // Wait for the list of products to load
    await page.waitForSelector('[data-testid="product-list"]');

    // Introduce a delay to allow time for all products to load
    await page.waitForTimeout(2000); // Adjust the interval as needed

    // Retrieve all the product items
    const productItems = await page.$$('[data-testid="product-card-container"]');
    const scrapedData = [];
    console.log('Total Products:', productItems.length)

    // Recursive function to handle each product
    for (let i = 0; i < productItems.length; i++) {
        // Click on the product using evaluate() inside the page's context
        await page.evaluate((index) => {
            const productItems = document.querySelectorAll('.sc-kOPcWz.dSFUBN.sc-eWzREE.jhhgth.sc-eWzREE.jhhgth');
            productItems[index].click();
        }, i);

        // Wait for the specific element to load after the click
        await page.waitForSelector('.sc-fqkvVR.dUvaSJ.sc-ezreuY.fICHEO', {visible: true});

        // Retrieve the specific element
        const specificElement = await page.evaluate(() => {
            const model = document.querySelector('table.sc-fqkvVR > tbody:nth-child(1) > tr:nth-child(3) > td:nth-child(2) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1)  ').innerText;
            console.log(model);
        });
        console.log('Specific Element:', specificElement);

        // Perform other scraping actions with different elements inside the product
        // const otherElement = await page.$eval('.other-element', (element) => element.innerText);
        // console.log('Other Element:', otherElement);

        // Create an object to store the scraped data for the current product
        const productData = {
            specificElement,

        };

        scrapedData.push(productData);

        await page.goBack();

        await page.waitForTimeout(1000); // Adjust the interval as needed
    }

    await browser.close();
    // Start processing the first product
}

// Usage: Call the scrapeProducts function with the URL of the product list page
scrapeProducts('https://www.magazineluiza.com.br/busca/geladeira/?page=1');
