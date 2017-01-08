import randomstring from 'randomstring';

const generateSlackLikeId = (type) => {
  const id = randomstring.generate(8).toUpperCase();

  return type.toUpperCase() + id;
};
const camelCaseToUnderscore = (word) => {
  // http://stackoverflow.com/questions/30521224/javascript-convert-camel-case-to-underscore-case
  return word.replace(/([A-Z]+)/g, (x, y) => { return `_${y.toLowerCase()}`; }).replace(/^_/, '');
};
const sendResponse = (req, res) => {
  let {
    returnObj,
  } = res.locals;
  if (typeof returnObj !== 'object') {
    returnObj = {};
  }
  res.status(200).json({ ok: true, ...returnObj });
};

export {
  generateSlackLikeId,
  camelCaseToUnderscore,
  sendResponse,
};
