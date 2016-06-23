"use strict";

const config = require('config');
const express = require('express');
const r = require('rethinkdb');
const Promise = require('bluebird');
const db = require('../db.js');
const SwipesError = require('../swipes-error');
const swipesCardSsr = require('../utils/swipes_card_ssr');
const serviceDir = __dirname + '/../../services/';
const router = express.Router();

const mapCardFields = (cardData, map) => {

  return {
    title: cardData[map.title]
  }
}

router.get('/SW-*', (req, res, next) => {
  const pathParts = req.originalUrl.split('/');
  const swipesUrl = pathParts[2];
  const getSwipesUrlQ = r.table('links').getAll(swipesUrl, {index: 'short_url'});

  let shortUrl = null;
  let userServiceData = null;
  let serviceData = null;
  let workflow = null;

  db.rethinkQuery(getSwipesUrlQ)
    .then((data) => {
      shortUrl = data[0];
      // T_TODO handle if there is no service like that

      const userId = shortUrl.userId;
      const serviceId = shortUrl.service.id;
      const serviceName = shortUrl.service.service_name;
      const workflowId = shortUrl.service.workflow_id;
      const getServiceQ =
        r.table('users')
          .get(userId)('services')
          .filter((service) => {
            return service('id').eq(serviceId).and(service('service_name').eq(serviceName))
          })
      const getWorkflowQ =
        r.table('workflows').get(workflowId);
      const promisesQ = [db.rethinkQuery(getServiceQ), db.rethinkQuery(getWorkflowQ)];

      return Promise.all(promisesQ);
    })
    .then((data) => {
      // T_TODO handle if there is no authed service in the user record
      // or there is no a user anymore
      userServiceData = data[0][0]; // user service object
      workflow = data[1];
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
    		method: shortUrl.service.method,
    		params: shortUrl.service.data,
    		user: {userId: shortUrl.userId},
    		service: {serviceId: shortUrl.service.id}
    	};

    	file.request(options, function (err, result) {
    		if (err) {
    			return res.status(200).json({ok: false, err: err});
    		}

        const map = shortUrl.service.fieldsMap;
        const mappedResult = mapCardFields(result, map);

        mappedResult.workflow = workflow;

        // T_TODO replace this with dynamic actions from the service
        const actions = [
          [
            {
              label: 'Say Hello',
              icon: 'check',
              bgColor: 'green',
              method: 'tasks.update',
              data: {
                id: '1234567',
                completed: true
              }
            }
          ]
        ];

        mappedResult.swipesDotActions = actions;

        res.send(swipesCardSsr.renderIndex(mappedResult));
    	});
    })
    .catch((e) => {
      return next(e);
    })
})

module.exports = router;
