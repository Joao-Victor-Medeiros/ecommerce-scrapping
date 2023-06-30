const ExcelJS = require('exceljs');
const puppeteer = require("puppeteer");
const XLSX = require("xlsx");
const path = require('path');
const fs = require('fs');

const URL = `https://www.magazineluiza.com.br/busca/geladeira/`;
const scraper = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(URL, {waitUntil: 'networkidle2'});


    const models = await page.$$eval('[data-testid="product-card-container"]', (nodes) => {
        const regex = /\b[A-Z]\w*\d\w*\b/;

        return nodes.map((node) => {
            const nameElement = node.querySelector('[data-testid="product-title"]');
            const priceElement = node.querySelector('[data-testid="price-value"]');

            const name = nameElement ? nameElement.innerText : '';
            const price = priceElement ? priceElement.innerText : '';
            const model = name.match(regex)
            return {name, model, price};
        });
    });

    worksheet.columns = [
        { header: 'Name', key: 'name' },
        { header: 'Price', key: 'price' },
        { header: 'Model', key: 'model' }
    ];


    models.forEach((item) => {
        worksheet.addRow(item);
    });
    const directory = './sheets';
    const filePath = path.join(directory, 'data.xlsx');
    workbook.xlsx.writeFile(filePath).then(() => {
        console.log('File saved successfully!');
    });

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }

    await browser.close();
}

scraper();