var express = require( 'express' );
var getSlug = require('speakingurl');
var r = require('rethinkdb');
var moment = require('moment');
var util = require('../util.js');
var onConnect = util.rethinkdbOnConnect;
var generateId = util.generateSlackLikeId;

var router = express.Router();


router.post('/channels.create', function (req, res, next) {
  var doc = {};

  doc.id = generateId('C');
  doc.name = getSlug(req.body.name);
  doc.is_archived = false;
  doc.created = moment().unix();

  onConnect()
    .then(function (conn) {
      r.branch(
        r.table("channels").getAll(doc.name, {index: "name"}).isEmpty(),
        r.table('channels').insert(doc),
        {}
      ).run(conn)
        .then(function (results) {
          conn.close();

          if (util.isEmpty(results)) {
            res.status(409).json({err: 'There is a channel with that name.'});
          } else {
            res.status(200).json({});
          }
        }).error(function (err) {
          conn.close();
          return next(err);
        });
    }).error(function (err) {
      return next(err);
    });
});

module.exports = router;
