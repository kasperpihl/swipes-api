"use strict";

const config = require('config');
const express = require('express');
const r = require('rethinkdb');
const Promise = require('bluebird');
const db = require('../db.js');
const SwipesError = require('../swipes-error');

const serviceDir = __dirname + '/../../services/';
const router = express.Router();

router.get('/', (req, res, next) => {
  const path = req.originalUrl;
  const swipesUrl = path.substring(1);
  const getSwipesUrlQ = r.table('links').getAll(swipesUrl, {index: 'short_url'});

  let shortUrl = null;
  let userServiceData = null;
  let serviceData = null;

  db.rethinkQuery(getSwipesUrlQ)
    .then((data) => {
      shortUrl = data[0];
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
      userServiceData = data[0];
      const serviceQ = r.table('services').get(userServiceData.service_id);

      return db.rethinkQuery(serviceQ);
    })
    .then((data) => {
      // T_TODO service not found error
      serviceData = data;
      let file = null;

      try {
    		file = require(serviceDir + serviceData.folder_name + '/' + serviceData.script);
    	}
    	catch (e) {
        // T_TODO nicer error if there is no file
    		return next(e);
    	}

      // T_TODO error if there is no file
      const options = {
    		authData: userServiceData.authData,
    		method: shortUrl.service.method,
    		params: shortUrl.service.data,
    		user: {userId: shortUrl.userId},
    		service: {serviceId: shortUrl.service.service_id}
    	};
      
    	file.request(options, function (err, result) {
    		if (err) {
    			return res.status(200).json({ok:false, err: err});
    		}

    		res.send({ok: true, data: result});
    	});
    })
    .catch((e) => {
      return next(e);
    })
})

module.exports = router;
