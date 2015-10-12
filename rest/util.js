var r = require('rethinkdb');
var randomstring = require('randomstring');

var util = {
  rethinkdbOnConnect: function () {
    return r.connect({host: 'localhost', port: 28015, db: 'swipes' });
  },
  // type is one of the slack types [U, C, G]
  // U for user
  // C for channel
  // G for group
  generateSlackLikeId: function (type) {
    type = type.toUpperCase();
    id = randomstring.generate(8).toUpperCase();

    return type + id;
  },
  // suports only objects for now
  isEmpty: function (obj) {
    return Object.keys(obj).length === 0;
  }
};

module.exports = util;
