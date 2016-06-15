"use strict";

const config = require('config');
const express = require('express');
const r = require('rethinkdb');
const Promise = require('bluebird');
const db = require('../db.js');
const SwipesError = require('../swipes-error');

const router = express.Router();

router.get('/', (req, res, next) => {
  const path = req.originalUrl;
  const swipesUrl = path.substring(1);
  const getSwipesUrlQ = r.table('links').getAll(swipesUrl, {index: 'short_url'});

  db.rethinkQuery(getSwipesUrlQ)
    .then((data) => {
      const shortUrl = data[0];
      // T_TODO handle if there is no service like that

      const userId = shortUrl.userId;
      const serviceId = shortUrl.service.service_id;
      const serviceName = shortUrl.service.service_name;
      const getServiceQ =
        r.table('users')
          .get(userId)('services')
          .filter((service) => {
            return service('id').eq(serviceId).and(service('service_name').eq(serviceName))
          })

      return db.rethinkQuery(getServiceQ);
    })
    .then((data) => {
      // T_TODO handle if there is no authed service in the user record
      // or there is no a user anymore
      return res.send(data);
    })
    .catch((e) => {
      return next(e);
    })
})

module.exports = router;
