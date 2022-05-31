import axios from 'axios';
import jsdom from 'jsdom';
import fs from 'fs'

const url = 'https://my.avon.ru/api/findarepapi/findbylocation/?longitude=34.485&latitude=63.080';
const start = [35.540, 57.030];
const end = [36.540, 56.700]

const run = async ([startLat, startlng], [stopLat, stoplng]) => {
  let currentLat = startLat;
  let currentLng = startlng;
  let isRun = true;

  while (isRun) {
    const url = `https://my.avon.ru/api/findarepapi/findbylocation/?longitude=${currentLat}&latitude=${currentLng}`;
    await fetchProfiles(url);
    currentLat += 0.02;
  } else

};

const fetchProfiles = async (url) => {
  try {
    const { data } = await axios.get(url);
    return data.Data.Representatives;
    // console.log(profiles);
    // fs.appendFileSync('result.csv', `\n${string}`);
  } catch (error) {
    console.log(`error message ===> ${error.message}`);
    // fs.appendFileSync('errors.csv', `\n\'${url}\',`);
  }
};

console.log(fetchProfiles(url));
/* profiles.forEach(async (url) => {
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
 */
