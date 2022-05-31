import axios from 'axios';
import jsdom from 'jsdom';
import profiles from './profiles.js';
import fs from 'fs'
import makePageParse from './parser.js';
import { sleep } from './utils.js';

profiles.forEach(async (url) => {
  try {
    const { data } = await axios.get(url);

    const dom = new jsdom.JSDOM(data).window.document;
    const userData = makePageParse(url, dom);
    const string = userData.join('~');
    console.log(string);
    fs.appendFileSync('result.csv', `\n${string}`);
    // sleep(100);
  } catch (error) {
    console.log(`error message ===> ${error.message}`);
    fs.appendFileSync('errors.csv', `\n\'${url}\',`);
  }
});
