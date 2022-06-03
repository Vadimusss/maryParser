const sleep = (milliseconds) => {
  var t = (new Date()).getTime();
  var i = 0;
  while (((new Date()).getTime() - t) < milliseconds) {
    i++;
  }
};

const makeUniqIdSet = () => {
  const set = new Set ();
  return {
    add: (id) => set.add(id),
    idIsUniq: (id) => !set.has(id),
  };
};

const generateSubUrls = (lng, lat, step, urlsNeed) => {
  const urls = [];
  let i = urlsNeed;
  let subLng = lng;

  while (i > 0) {
    urls.push(`https://my.avon.ru/api/findarepapi/findbylocation/?longitude=${subLng.toFixed(2)}&latitude=${lat.toFixed(2)}`);
    subLng = subLng + step;
    i--;
  }

  return urls;
};

export { sleep, makeUniqIdSet, generateSubUrls };
