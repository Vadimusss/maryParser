import axios from 'axios';
import fs from 'fs';
import { normalizeWhiteSpaces } from 'normalize-text';
import { generateSubUrls, makeUniqIdSet } from './utils.js';
// import promiseAllEnd from 'promiseallend';
import _ from 'lodash';
import { JSDOM } from 'jsdom';
// import puppeteer from 'puppeteer'; /* установить отдельно */

const run = async () => {
  const json = fs.readFileSync('reParse.json');
  const profiles = JSON.parse(json);
  const baseUrl = 'https://www.jafra.com/contact/contact-me/?personalWebsite=';
  let reParse = [];
  
  for (const { consultantId, firstName, lastName, zipCode, state, city, isActive } of profiles) {
    try {
      console.log(consultantId);
      const response = await axios.get(`${baseUrl}${consultantId}`);
      const document = new JSDOM(response.data).window.document;
      const container = document.querySelector('.my-info');

      const preferredLanguage = container.querySelector('p:nth-child(3)').textContent.slice(20);
      const phoneNumber = container.querySelector('p:nth-child(4)').textContent.split(/\(\D/)[0];
      const eMail = container.querySelector('p:nth-child(5)>a') === null ? '-' : container.querySelector('p:nth-child(5)>a').textContent.trim();
      const page = document.querySelector('.my-info p:nth-child(6)>a') === null ? '-' : document.querySelector('.my-info p:nth-child(6)>a').textContent.trim();

      const string = normalizeWhiteSpaces([consultantId, firstName, lastName, phoneNumber, eMail, page, preferredLanguage, zipCode, state, city, isActive].join('~'));

      console.log(string);
      fs.appendFileSync('result.csv', `\n${string}`);
    } catch (error) {
      console.log(`error message in catch ===> ${error.message}`);
      console.log(`error consultantId in catch ===> ${consultantId}`);
      fs.appendFileSync('errors.csv', `\n\'${consultantId} - ${error.message}\',`);
      
      reParse = [...reParse, {
        consultantId,
        firstName,
        lastName,
        zipCode,
        state,
        city,
        sessionLanguage: null,
        isActive,
      }];
    }
  }

  fs.writeFileSync('reParse.json', JSON.stringify(reParse), 'utf8', console.log);
};

run();