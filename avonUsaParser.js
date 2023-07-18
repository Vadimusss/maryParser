import axios from 'axios';
import fs from 'fs';
import { normalizeWhiteSpaces } from 'normalize-text';
import { generateSubUrls, makeUniqIdSet } from './utils.js';
// import promiseAllEnd from 'promiseallend';
// import _ from 'lodash';
// import { JSDOM } from 'jsdom';
// import puppeteer from 'puppeteer'; /* установить отдельно */

const stateCodes = [
  'AA', 'AE', 'AK', 'AL', 'AP', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL',
  'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI',
  'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH',
  'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY'
];

const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

const run = async () => {
  const json = fs.readFileSync('reParse.json');
  let reParse = [];

  for (const stateCode of stateCodes) {
    for (const firstChar of alphabet) {
      for (const secondChar of alphabet) {
        const url = `https://prod-ecom-custapi-aws.avon.com/v1/avon/far/names?lastName=${firstChar}${secondChar}&stateCode=${stateCode}&page=1&pageSize=1000`;

        try {
          console.log(url);

          const response = await axios.get(url);
          const profiles = response.data.data.list;
          if (profiles.length !== 0) {
            profiles.forEach(({
              repAcctNr,
              name,
              repIntroduceResList,
              phoneNumber,
              address1,
              address2,
              cityName,
              stateCode,
              mediaUrl,
              matchRate,
              speakLanguage,
              storeUrl,
              profileImageUrl,
              deliveryOption,
              zipCode,
              categories,
              lifeStyles,
              interests,
            }) => {
              const string = [
                repAcctNr,
                name,
                normalizeWhiteSpaces(repIntroduceResList.map(({ introCode, introText}) => `${introCode}: ${introText}`).join(', ')), // []
                phoneNumber,
                address1,
                address2,
                cityName,
                stateCode,
                mediaUrl,
                matchRate,
                speakLanguage.join(', '),
                storeUrl,
                profileImageUrl,
                deliveryOption,
                zipCode,
                normalizeWhiteSpaces(categories.map(({ name }) => name).join(', ')),
                normalizeWhiteSpaces(lifeStyles.map(({ name }) => name).join(', ')),
                normalizeWhiteSpaces(interests.map(({ name }) => name).join(', ')),
              ].join(`~`);

              console.log(string);
              fs.appendFileSync('result.csv', `\n${string}`);
            }); 
          }
        } catch (error) {
          console.log(`error message in catch ===> ${error.message}`);
          console.log(`error url in catch ===> ${url}`);
          fs.appendFileSync('errors.csv', `\n\'${url} - ${error.message}\',`);
          reParse = [...reParse, url];
        }
      }
    }
  }

  fs.writeFileSync('reParse.json', JSON.stringify(reParse), 'utf8', console.log);
};

run();