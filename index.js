import axios from 'axios';
import fs from 'fs'
import { normalizeWhiteSpaces } from 'normalize-text';
import { generateSubUrls, makeUniqIdSet } from './utils.js';
import promiseAllEnd from 'promiseallend';
import _ from 'lodash';

/* долгота, широта */
const start = [26.82, 68.45];
const end = [61.98, 50.43];
const uniqIdSet = makeUniqIdSet();

const run = async ([startLng, startLat], [stopLng, stopLat]) => {
  let currentLng = startLng;
  let currentLat = startLat;
  let isRun = true;
  let logStringCount = 0;
  let isOffset = false;
  let offset = 0.02;

  while (isRun) {
    const urls = generateSubUrls(currentLng, currentLat, 0.04, 10);
    urls.map((url) => console.log(url));
    await fetchProfiles(urls);

    if (logStringCount < 11) {
      fs.appendFileSync('parseLog.csv', `\n\'${currentLng.toFixed(2)}:${currentLat.toFixed(2)}\',`);
      logStringCount++;
    } else {
      fs.truncateSync('parseLog.csv');
      logStringCount = 0;
    }

    if (currentLng < stopLng) {
      currentLng += 0.4;
    } else if (currentLat > stopLat) {
      currentLng = startLng;
      if (isOffset) {
        currentLng + offset;
      }
      isOffset = !isOffset;
      currentLat -= 0.02;
    } else {
      isRun = false;
    }
  }
};

const fetchProfiles = async (urls) => {
  try {

    const promises = urls.map(async (url) => {
      return axios.get(url, { timeout: 5000, maxContentLength: Infinity, maxBodyLength: Infinity });
    });

    const responses = await promiseAllEnd(promises, {
      unhandledRejection(error, index) {
        console.log(`error message in promiseAllEnd ===> ${error.message}`);
        console.log(`error url in promiseAllEnd ===> ${urls[index]}`);
        fs.appendFileSync('errors.csv', `\n\'in promiseAllEnd => ${urls[index]} - ${error.message}\',`);
      }
    });
    const allProfiles = responses.map((response) => response.data.Data.Representatives);
    const uniqProfiles = _.uniqBy(allProfiles.flat(), 'Id');

    if (uniqProfiles.length > 0) {
      uniqProfiles.forEach(({
        Email,
        FullName,
        Id,
        Message,
        Mobile,
        City,
        StoreName,
        ContactDetails,
        DeliveryDescription,
      }) => {
        if (uniqIdSet.idIsUniq(Id)) {
          uniqIdSet.add(Id);
          const string = normalizeWhiteSpaces([Id, FullName, Mobile, Email, City, Message, StoreName, ContactDetails, DeliveryDescription].join('~'));
          console.log(string);
          fs.appendFileSync('result.csv', `\n${string}`);
        } else {
          console.log(`not uniq id ===> ${Id}`);
        };
      });
    }
  } catch (error) {
    console.log(`error message in catch ===> ${error.message}`);
    fs.appendFileSync('errors.csv', `\n\'in catch => ${error.message}\',`);
  }
};

run(start, end);
