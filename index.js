import axios from 'axios';
import fs from 'fs'
import { normalizeWhiteSpaces } from 'normalize-text';
import { generateSubUrls, makeUniqIdSet } from './utils.js';
import { JSDOM } from 'jsdom';
import _ from 'lodash';

function* generatePagesLiks() {
  let page = 1;
  const numberOfPages = 5;

  while (page <= numberOfPages) {
    yield `https://www.roi.ru/poll/?page=${page}`;
    page++;
  }
}

/* const fetchExtendedData = async (url, id) => {
  console.log(`${url}${id}`);

  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto(`${url}${id}`, { waitUntil: 'networkidle2' });

  const phoneNumber = await page.evaluate(() => {
    if (document.querySelector('a[data-v-43c2983d]') !== null) {
      return document.querySelector('a[data-v-43c2983d]').href.slice(4);
    }
    return '-';
  });
  // console.log(phoneNumber);
  await browser.close();

  return phoneNumber;
}; */

const run = async () => {
  const urlGenerator = generatePagesLiks();
  for(let url of urlGenerator) {
    try {
      const response = await axios.get(url);
      const document = new JSDOM(response.data).window.document;
      const links = document.querySelectorAll('.item a');
      links.forEach(link => {
        console.log(`https://www.roi.ru${link.href}`);
      });
  
      //console.log(response.data);
      
      // fs.appendFileSync('result.csv', `\n${string}`);
    } catch (error) {
      console.log(`error message in catch ===> ${error.message}`);
      // fs.appendFileSync('errors.csv', `\n\'in catch => ${error.message}\',`);
      // fs.appendFileSync('errors.csv', `\n\'url is => https://www.amway.ru/users/${person__abo_number}\',`);
    }
  }
};

run();
