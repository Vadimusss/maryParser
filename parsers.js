import { normalizeWhiteSpaces } from 'normalize-text';

const maryKeyParser = (profileUrl, dom) => {
  const name = dom.querySelector('.ibc-name h1') ? dom.querySelector('.ibc-name h1').textContent : '-';
  const status = dom.querySelector('.ibc-title') ? dom.querySelector('.ibc-title').textContent : '-';
  const mobilePhone = dom.querySelector('[data-phone-type="Mobile"]') ? dom.querySelector('[data-phone-type="Mobile"]').textContent : '-';
  const homePhone = dom.querySelector('[data-phone-type="Home"]') ? dom.querySelector('[data-phone-type="Home"]').textContent : '-';
  const workPhone = dom.querySelector('[data-phone-type="Work"]') ? dom.querySelector('[data-phone-type="Work"]').textContent : '-';
  const socialLinks = dom.querySelectorAll('.connect-on a');
  const vkLink = socialLinks[0] ? socialLinks[0].href : '-';
  const odLink = socialLinks[1] ? socialLinks[1].href : '-';
  const text = dom.querySelector('.how-callout > .content > p') ?
    normalizeWhiteSpaces(dom.querySelector('.how-callout .content > p').textContent).replace(';', '.') : '-';

  return [
    name,
    mobilePhone,
    homePhone,
    workPhone,
    status,
    vkLink,
    odLink,
    text,
    profileUrl,
  ];
};

const avonParser = (avonProfile) => {

};

const amwayParser = async (dom) => {
  amway
};

export { maryKeyParser, avonParser };
