"use strict";

import config from 'config';
import express from 'express';
import r from 'rethinkdb';
import Promise from 'bluebird';
import shortid from 'shortid';
import hash from 'object-hash';
import db from '../db.js';
import SwipesError from '../swipes-error';

const serviceDir = __dirname + '/../../services/';

const createSwipesShortUrl = ({ userId, service }) => {
  const checksum = hash({ service, userId });
  const checkSumQ = r.table('links').getAll(checksum, {index: 'checksum'});
  let shortUrl = null;

  return db.rethinkQuery(checkSumQ)
    .then((res) => {
      if (res.length > 0) {
        shortUrl = res[0].short_url;

        return Promise.resolve(shortUrl);
      }

      shortUrl = shortid.generate();
      const link = {
        checksum: checksum,
        service: service,
        short_url: shortUrl,
        userId: userId
      };

      return fetchSwipesUrlData(null, link)
        .then((linkData) => {
          const insertLinkQ = r.table('links').insert(linkData);

          return db.rethinkQuery(insertLinkQ);
        })
        .catch((err) => {
          return Promise.reject(err);
        })
    })
    .then(() => {
      return Promise.resolve(shortUrl);
    })
    .catch((e) => {
      return Promise.reject(e);
    })
}

// T_TODO This is super mega giga hack
const fetchSwipesUrlData = (shortUrlId = null, shortUrlData = null) => {
  let initPromise;

  if (shortUrlId) {
    const getSwipesUrlQ = r.table('links').getAll(shareId, {index: 'short_url'}).nth(0);
    initPromise = db.rethinkQuery(getSwipesUrlQ);
  } else {
    initPromise = Promise.resolve(shortUrlData);
  }

  let shortUrl = null;
  let userServiceData = null;
  let serviceData = null;

  return initPromise
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
                    .eq(serviceId + '')
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
    		return Promise.reject('File not found');
    	}

      const options = {
    		authData: userServiceData.authData,
    		itemId: shortUrl.service.item_id,
    		user: {userId: shortUrl.userId},
    		service: {serviceId: shortUrl.service.account_id},
        type: shortUrl.service.type
    	};

      if (!file.shareRequest) {
        return Promise.reject('The service does not support swipes card yet');
      }

      return new Promise((resolve, reject) => {
        file.shareRequest(options, function (err, result) {
      		if (err) {
            return reject(err);
      		}

          shortUrl = Object.assign({}, shortUrl, result);

          return resolve(shortUrl);
      	});
      })
    })
    .catch((e) => {
      return Promise.reject(e);
    })
}

export {
  createSwipesShortUrl,
  fetchSwipesUrlData
}
