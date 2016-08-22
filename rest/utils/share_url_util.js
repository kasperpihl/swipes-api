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

const createSwipesShortUrl = ({ userId, accountId, service }) => {
  const checksum = hash({ service });
  const checkSumQ = r.table('links').getAll(checksum, {index: 'checksum'});
  let shortUrl = null;
  let serviceData = null;

  return db.rethinkQuery(checkSumQ)
    .then((res) => {
      if (res.length > 0) {
        shortUrl = res[0].short_url;
        serviceData = res[0].service_data;

        return Promise.resolve({shortUrl, serviceData});
      } else {
        shortUrl = shortid.generate();
        const shortUrlData = {
          short_url: shortUrl,
          checksum,
          service
        };

        return fetchSwipesUrlData({userId, accountId, shortUrlData})
          .then((linkData) => {
            const insertLinkQ = r.table('links').insert(linkData);
            serviceData = linkData.service_data;

            return db.rethinkQuery(insertLinkQ);
          })
          .then((result) => {
            const link_id = result.generated_keys[0];
            const checkQ =
              r.table('link_rels')
                .getAll(link_id, {index: 'link_id'})
                .map((link) => {
                  return link('user_id')
                })
                .contains(userId)


            db.rethinkQuery(checkQ)
              .then((rels) => {
                if (rels) {
                  return Promise.resolve();
                } else {
                  const linkRelQ = r.table('link_rels').insert({
                    link_id,
                    user_id: userId,
                    account_id: accountId
                  });

                  return db.rethinkQuery(linkRelQ);
                }
              })
              .catch((err) => {
                return Promise.reject(err);
              })
          })
          .then(() => {
            return Promise.resolve({shortUrl, serviceData});
          })
      }
    })
    .catch((e) => {
      return Promise.reject(e);
    })
}

const fetchSwipesUrlData = ({userId, accountId, shortUrlData}) => {
  const serviceName = shortUrlData.service.name;
  const getServiceQ =
    r.table('users')
      .get(userId)('services')
      .filter((service) => {
        return service('id')
          .coerceTo('string')
          .eq(accountId + '')
          .and(
            service('service_name')
            .coerceTo('string')
            .eq(serviceName)
          )
      })

  let shortUrl = null;
  let userServiceData = null;
  let serviceData = null;

  return db.rethinkQuery(getServiceQ)
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
    		itemId: shortUrlData.service.item_id,
    		user: {userId},
    		service: {serviceId: accountId},
        type: shortUrlData.service.type
    	};

      if (!file.shareRequest) {
        return Promise.reject('The service does not support swipes card yet');
      }

      return new Promise((resolve, reject) => {
        file.shareRequest(options, function (err, result) {
      		if (err) {
            return reject(err);
      		}

          shortUrlData = Object.assign({}, shortUrlData, {
            service_data: result.serviceData,
            service_actions: result.serviceActions
          });

          return resolve(shortUrlData);
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
