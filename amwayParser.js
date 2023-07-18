import axios from 'axios';
import fs from 'fs'
import { normalizeWhiteSpaces } from 'normalize-text';
import { generateSubUrls, makeUniqIdSet } from './utils.js';
import promiseAllEnd from 'promiseallend';
import _ from 'lodash';
import puppeteer from 'puppeteer'; /* установить отдельно */

const fetchExtendedData = async (url, id) => {
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
};

const run = async () => {
  const data = fs.readFileSync('profiles.json', 'utf8');
  const profiles = JSON.parse(data);

  for (const {
    person__abo_number,
    person__have_personal_page,
    category__display_name,
    person__region__name,
    person__names,
    person__genders,
    person__is_bronze_club,
    nomination_period,
  } of profiles) {
    try {
      let phoneNumber = person__have_personal_page ?
        await fetchExtendedData('https://www.amway.ru/users/', person__abo_number) : '-';

      const nameOne = person__names[0].join(' ').trim();
      const nameTwo = person__names.length === 2 ? person__names[1].join(' ').trim() : '-';


      const string = normalizeWhiteSpaces([
        person__abo_number,
        nameOne,
        nameTwo,
        person__genders.join(', '),
        phoneNumber,
        person__region__name,
        category__display_name,
        String(person__is_bronze_club),
        nomination_period,
      ].join('~'));
      console.log(string);
      fs.appendFileSync('result.csv', `\n${string}`);
    } catch (error) {
      console.log(`error message in catch ===> ${error.message}`);
      fs.appendFileSync('errors.csv', `\n\'in catch => ${error.message}\',`);
      fs.appendFileSync('errors.csv', `\n\'url is => https://www.amway.ru/users/${person__abo_number}\',`);
    }
  }
};

run();
