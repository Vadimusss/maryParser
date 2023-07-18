import fs from 'fs';
import excel4node from 'excel4node';
import superagent from 'superagent';

const agent = superagent.agent();

function* generatePagesLiks() {
  let page = 1;

  while (true) {
    yield `https://duplo-api.shinservice.ru/api/v1/tyre.json?page=${page}&_aid=128&_cid=3170&_uid=6437`;
    page++;
  }
}

const run = async () => {
  let token = '';

  try {
    const dashboard = await agent.post('https://duplo-api.shinservice.ru/api/v1/user/login.json?')
      .send(JSON.stringify({ email: 'sales@tyres4u.ru', password: '291600' }))
      .set('Content-type', 'application/json; charset=UTF-8');

    token = JSON.parse(dashboard.text).token;
  } catch (error) {
    console.log(`Authorization error, message ===> ${error.message}`);
    fs.appendFileSync('errors.csv', `\n\'Authorization error, ===> ${error.message}\',`);
  }

  const generator = generatePagesLiks();
  let isDone = false;
  let currentRow = 2;
  let url = '';
  const excelWorkbook = new excel4node.Workbook();
  const excelWorksheet = excelWorkbook.addWorksheet('Шины');
  [
    'Марка',
    'Модель',
    'Ширина',
    'Высота',
    'Диаметр',
    'Сезон',
    'Runflat',
    'Шип',
    'Индекс нагрузки',
    'Индекс скорости',
    'Наличие',
    'Цена',
  ].forEach((value, index) => excelWorksheet.cell(1, index + 1).string(value));

  try {
    while (!isDone) {
      url = generator.next().value;
      const response = await agent.get(url)
        .set('authorization', `Bearer ${token}`);

      const tyresArray = JSON.parse(response.text);

      if (tyresArray.length !== 0) {

        tyresArray.forEach(({
          brand: { name: brandName },
          model: { name: modelName },
          size: { width },
          size: { profile },
          size: { radius },
          params: {
            season: { id: season },
            runflat,
            pins,
            loadIndex: { index: loadIndex },
            speedRating: { index: speedIndex },
          },
          stock: {
            price,
            amount,
          }
        }) => {
          const row = [
            brandName.split(' ')[0],
            modelName,
            width,
            profile,
            radius,
            season,
            runflat ? 'да' : 'нет',
            pins ? 'да' : 'нет',
            loadIndex,
            speedIndex,
            amount,
            price,
          ];

          row.forEach((value, index) => {
            if (typeof value === 'number') {
              excelWorksheet.cell(currentRow, index + 1).number(value);
            } else {
              excelWorksheet.cell(currentRow, index + 1).string(String(value));
            };
          });

          currentRow++;
        });

      } else {
        isDone = true;
        excelWorkbook.write('stock.xlsx');
        console.log('Success!!!');
      }
    }
  } catch (error) {
    console.log(`Parse error, message ===> ${error.message}`);
    fs.appendFileSync('errors.csv', `\n\'Parse error, url: ${url}, message: ${error.message}\',`);
  }
};

run();
