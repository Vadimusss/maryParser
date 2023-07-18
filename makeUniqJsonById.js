import fs from 'fs';
import _ from 'lodash';

const makeUniqJsomById = async () => {
  const json = fs.readFileSync('newProfiles.json');
  const data = _.uniqBy(JSON.parse(json), 'consultantId');
  fs.writeFileSync('jafraProfiles.json', JSON.stringify(data), 'utf8', console.log);
};

makeUniqJsomById();
