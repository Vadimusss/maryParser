import axios from 'axios';
import fs from 'fs'
import { normalizeWhiteSpaces } from 'normalize-text';
import { generateSubUrls, makeUniqIdSet } from './utils.js';
import { JSDOM } from 'jsdom';
import _ from 'lodash';

function* generatePagesLiks() {
  let page = 1;
  const numberOfPages = 47;

  while (page <= numberOfPages) {
    yield `https://www.roi.ru/poll/?page=${page}`;
    page++;
  }
}

const fetchInitiativeData = async (url) => {
  const response = await axios.get(url);
  const document = new JSDOM(response.data).window.document;

  const number = document.querySelector('.b-initiative-props__number').textContent;
  const name = document.querySelector('h1').textContent;
  const affirmative = parseInt(document.querySelector('.js-voting-info-affirmative').textContent.replace(/[^\d]/g, ''));
  const negative = parseInt(document.querySelector('.js-voting-info-negative').textContent.replace(/[^\d]/g, ''));

  return [number, name, affirmative, negative, url];
};

const getInitiativesLinks = async (url, base) => {
  const response = await axios.get(url);
  const document = new JSDOM(response.data).window.document;
  const urls = [...document.querySelectorAll('.item a')].map((element) => `${base}${element.href}`);

  return urls;
};

const run = async () => {
  const urlGenerator = generatePagesLiks();
  for (let url of urlGenerator) {
    try {
      const initiativesLinks = await getInitiativesLinks(url, 'https://www.roi.ru');
      const initiativesData = await Promise.all(initiativesLinks.map(async (link) => await fetchInitiativeData(link)));

      initiativesData.forEach((initiativeDataArr) => {
        const dataString = initiativeDataArr.join('~');
        console.log(dataString);
        fs.appendFileSync('result.csv', `\n${dataString}`);
      });
    } catch (error) {
      console.log(`error message in catch ===> ${error.message}`);
      fs.appendFileSync('errors.csv', `\n\'in catch => ${error.message}\',`);
    }
  }
};

run();
