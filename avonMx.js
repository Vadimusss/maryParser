import fs from 'fs';
import excel4node from 'excel4node';
import superagent from 'superagent';
import { zipcodes } from './mexicoPostcode.js';

const agent = superagent.agent();

const run = async () => {
  let currentRow = 2;
  const excelWorkbook = new excel4node.Workbook();
  const excelWorksheet = excelWorkbook.addWorksheet('Представители');
  [
    'personId',
    'level',
    'youtube',
    'instagram',
    'facebook',
    'lastUpdatedDate',
    'updated_at',
    'created_at',
    'brand',
    'country',
    'gender',
    'userName',
    'emailContact',
    'city',
    'state',
    'postalCode',
    'userId',
    'firstName',
    'lastName',
    'storeStatus',
    'cnRating',
    'picture1',
    'welcomeMsg',
    'welcomeMsg1',
    'welcomeMsg2',
    'picture2',
    'personNumber',
    'birthDate',
    'mobilePhone',
    'whatsappOptIn',
    'whatsappPhone',
  ].forEach((value, index) => excelWorksheet.cell(1, index + 1).string(value));

  for (let i = 0; i < zipcodes.length; i++) {
    try {
      const response = await agent.get(`https://ncf-experience-natura-bff-prd.us-e1.cloudhub.io/cn/search?query=${zipcodes[i]}&from=0&size=1000`)
        .set('Accept', '*/*')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set('Accept-Language', 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7')
        .set('Cache-Control', 'no-cache')
        .set('Connection', 'keep-alive')
        .set('Host', 'ncf-experience-natura-bff-prd.us-e1.cloudhub.io')
        .set('Origin', 'https', '//www.avon.mx')
        .set('Pragma', 'no-cache')
        .set('Referer', 'https', '//www.avon.mx/')
        .set('Sec-Fetch-Dest', 'empty')
        .set('Sec-Fetch-Mode', 'cors')
        .set('Sec-Fetch-Site', 'cross-site')
        .set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36')
        .set('client_id', '5e63ef537c0844f283e68d1ddafd7435')
        .set('client_secret', 'D3ACCc14132D4f0eA115bC5D0DE2b84D')
        .set('sec-ch-ua', '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"')
        .set('sec-ch-ua-mobile', '?0')
        .set('sec-ch-ua-platform', '"Linux"')
        .set('tenant_id', 'avon-mexico');

      const results = response._body.results;

      console.log(`${zipcodes[i]} => ${results.length}`);

      if (results.length > 0) {

        results.forEach(({
          personId,
          level,
          youtube,
          instagram,
          facebook,
          lastUpdatedDate,
          updated_at,
          created_at,
          brand,
          country,
          gender,
          userName,
          emailContact,
          city,
          state,
          postalCode,
          userId,
          firstName,
          lastName,
          storeStatus,
          cnRating,
          picture1,
          welcomeMsg,
          welcomeMsg1,
          welcomeMsg2,
          picture2,
          personNumber,
          birthDate,
          mobilePhone,
          whatsappOptIn,
          whatsappPhone,
        }) => {
          const row = [
            personId,
            level,
            youtube,
            instagram,
            facebook,
            lastUpdatedDate,
            updated_at,
            created_at,
            brand,
            country,
            gender,
            userName,
            emailContact,
            city,
            state,
            postalCode,
            userId,
            firstName,
            lastName,
            storeStatus,
            cnRating,
            picture1,
            welcomeMsg,
            welcomeMsg1,
            welcomeMsg2,
            picture2,
            personNumber,
            birthDate,
            mobilePhone,
            whatsappOptIn,
            whatsappPhone,
          ];

          row.forEach((value, index) => {
            excelWorksheet.cell(currentRow, index + 1).string(String(value));
          });

          currentRow++;
        });
      }
    } catch (error) {
      console.log(`${error.message}`);
      fs.appendFileSync('errors.csv', `\n\'${zipcode} - ${error.message}\',`);
    }
  }

  excelWorkbook.write('avonMx.xlsx');
  console.log('Success!!!');
};

run();
