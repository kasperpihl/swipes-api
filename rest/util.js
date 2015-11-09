"use strict";

let randomstring = require('randomstring');
let moment = require('moment');

let randomNumber = (length) => {
  let number = randomstring.generate({
    length: length,
    charset: 'numeric'
  });

  return number;
}

let util = {
  // type is one of the slack types [U, C, G]
  // U for user
  // C for channel
  // G for group
  generateSlackLikeId: (type) => {
    type = type.toUpperCase();
    let id = randomstring.generate(8).toUpperCase();

    return type + id;
  },
  generateSlackLikeTs: () => {
    let rNumber = randomNumber(3);
    let ts = moment().valueOf() + rNumber;

    return ts.substring(0,ts.length - 6) + "." + ts.substring(ts.length - 6);
  },
  // suports only objects for now
  isEmpty: (obj) => {
    return Object.keys(obj).length === 0;
  }
};

module.exports = util;
