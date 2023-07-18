import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.amway.ru/users/7645667');
    await page.screenshot({path: 'example.png'});
  
    await browser.close();
  })();