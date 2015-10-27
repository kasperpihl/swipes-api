var randomstring = require('randomstring');

var util = {
  // type is one of the slack types [U, C, G]
  // U for user
  // C for channel
  // G for group
  generateSlackLikeId: function (type) {
    type = type.toUpperCase();
    id = randomstring.generate(8).toUpperCase();

    return type + id;
  },
  randomNumber: function (length) {
    number = randomstring.generate({
      length: length,
      charset: 'numeric'
    });

    return number;
  },
  // suports only objects for now
  isEmpty: function (obj) {
    return Object.keys(obj).length === 0;
  },
  checkAuth: function (req, res, next) {
    if (!req.session.userId) {
      res.status(400).json({err: 'You are not authorized.'});
    } else {
      next();
    }
  }
};

module.exports = util;
