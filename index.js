import axios from 'axios';
import fs from 'fs'
import { normalizeWhiteSpaces } from 'normalize-text';
import { generateSubUrls, makeUniqIdSet } from './utils.js';
import { JSDOM } from 'jsdom';
import _ from 'lodash';

const regionsId = [
  /*31, 32, 33, 36, */77, /* 37, 40, 44, 46, 48, 50, 57, 62, 67, 68, 69, 71,
  76, 30, 34, 92, 23, 1, 8, 91, 61, 45, 66, 72, 86, 74, 89, 28, 79,
  41, 49, 25, 14, 65, 27, 87, 22, 75, 38, 42, 24, 54, 55, 4, 3, 17,
  19, 70, 7, 9, 5, 6, 15, 26, 20, 43, 52, 56, 58, 59, 2, 12, 13, 16,
  63, 64, 18, 73, 21, 29, 35, 78, 39, 47, 51, 83, 53, 60, 10, 11,*/
]

const currentParseUrl = 'https://www.roi.ru/poll/?level=2,3&archive=1';

function* generatePagesLiks(numberOfPages) {
  let page = 1;

  while (page <= numberOfPages) {
    yield `${currentParseUrl}&page=${page}`;
    page++;
  }
}

const fetchInitiativeData = async (url) => {
  const response = await axios.get(url);
  const document = new JSDOM(response.data).window.document;

  const number = document.querySelector('.b-initiative-props__number').textContent;
  const level = document.querySelector('.b-initiative-props').lastElementChild.lastElementChild.textContent;
  const name = document.querySelector('h1').textContent;
  const affirmative = parseInt(document.querySelector('.js-voting-info-affirmative').textContent.replace(/[^\d]/g, ''));
  const negative = parseInt(document.querySelector('.js-voting-info-negative').textContent.replace(/[^\d]/g, ''));
  const date = document.querySelector('.inic-side-info>.date').textContent;

  return [number, level, name, affirmative, negative, url, date];
};

const getInitiativesLinks = async (url, base, regionId) => {
  const response = await axios.get(url, {
    headers: {
      'Cookie': `regionId=${regionId}`,
    }
  });
  const document = new JSDOM(response.data).window.document;
  const urls = [...document.querySelectorAll('.item a')].map((element) => `${base}${element.href}`);

  return urls;
};

const getNumberOfPages = async (regionId) => {
  const response = await axios.get(currentParseUrl, {
    headers: {
      'Cookie': `regionId=${regionId}`,
    }
  });
  const document = new JSDOM(response.data).window.document;
  const numbersOfPages = await Promise.all([...document.querySelectorAll('[data-page]:not(.next)')].map((element) => Number(element.textContent))); 

  return (numbersOfPages.length !== 0) ? Math.max(...numbersOfPages) : 1;
};

const run = async () => {
  try {
    for (const regionId of regionsId) {
      const numberOfPages = await getNumberOfPages(regionId);

      const urlGenerator = generatePagesLiks(numberOfPages);
      for (let url of urlGenerator) {
        const initiativesLinks = await getInitiativesLinks(url, 'https://www.roi.ru', regionId);
        const initiativesData = await Promise.all(initiativesLinks.map(async (link) => await fetchInitiativeData(link)));

        initiativesData.forEach((initiativeDataArr) => {
          const dataString = initiativeDataArr.join('~');
          console.log(dataString);
          fs.appendFileSync('result.csv', `\n${dataString}`);
        });
      }
    }
  } catch (error) {
    console.log(`error message in catch ===> ${error.message}`);
    fs.appendFileSync('errors.csv', `\n\'in catch => ${error.message}\',`);
  }
};

run();
