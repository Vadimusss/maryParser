import axios from 'axios';
import fs from 'fs';

const pageNumbers = Array.from({ length: 49 }, (v, k) => k + 1);

const run = async () => {
  for (const pageNumber of pageNumbers) {
    const url = `https://www.shinservice.ru/api/search/tyres.json?page=${pageNumber}&result-mode=search&brand[]=michelin&brand[]=continental&brand[]=kumho`;

    try {
      console.log(url);

      const response = await axios.get(url);
      const tyres = response.data.payload;
      if (tyres.length !== 0) {
        tyres.forEach(({
          title,
          size: { width },
          size: { profile },
          size: { diameter },
          params: {
            runflat,
            pins,
            loadIndex: {index: loadIndex },
            speedRating: {index: speedIndex },
          },
          market: {
            price,
            amount,
          }
        }) => {
          const string = [
            title.split(' ')[0],
            title,
            pins ? 'шип' : '',
            width,
            profile,
            diameter,
            loadIndex,
            speedIndex,
            runflat ? 'да' : '',
            amount,
            price
          ].join(`~`);

          console.log(string);
          fs.appendFileSync('result.csv', `\n${string}`);
        });
      }
    } catch (error) {
      console.log(`error message in catch ===> ${error.message}`);
      console.log(`error url in catch ===> ${url}`);
      fs.appendFileSync('errors.csv', `\n\'${url} - ${error.message}\',`);
    }
  }

};

run();