"use strict";

const config = require('config');
const express = require('express');
const r = require('rethinkdb');
const Promise = require('bluebird');
const db = require('../db.js');
const SwipesError = require('../swipes-error');
const serviceDir = __dirname + '/../../services/';
const router = express.Router();

router.get('/share.getData', (req, res, next) => {
  const shareId = req.body.shareId;
  const getSwipesUrlQ = r.table('links').getAll(shareId, {index: 'short_url'}).nth(0);

  let shortUrl = null;
  let userServiceData = null;
  let serviceData = null;

  db.rethinkQuery(getSwipesUrlQ)
    .then((data) => {
      // T_TODO handle if there is no url like that
      shortUrl = data;

      const userId = shortUrl.userId;
      const serviceId = shortUrl.service.account_id;
      const serviceName = shortUrl.service.name;
      const getServiceQ =
        r.table('users')
          .get(userId)('services')
          .filter((service) => {
            return service('id')
                    .coerceTo('string')
                    .eq(serviceId)
                    .and(
                      service('service_name')
                      .coerceTo('string')
                      .eq(serviceName)
                    )
          })

      return db.rethinkQuery(getServiceQ);
    })
    .then((data) => {
      // T_TODO handle if there is no authed service in the user record
      // or there is no a user anymore
      userServiceData = data[0]; // user service object
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
    		return Promise.reject(e);
    	}

      // T_TODO error if there is no file
      const options = {
    		authData: userServiceData.authData,
    		params: {id: shortUrl.service.item_id},
    		user: {userId: shortUrl.userId},
    		service: {serviceId: shortUrl.service.account_id},
        type: shortUrl.service.type
    	};

    	file.shareRequest(options, function (err, result) {
    		if (err) {
    			return res.status(200).json({ok: false, err: err});
    		}

        res.send({ok: true, data: result});

    	});
    })
    .catch((e) => {
      return next(e);
    })
})

module.exports = router;
