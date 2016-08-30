"use strict";

import config from 'config';
import r from 'rethinkdb';
import Promise from 'bluebird';
import shortid from 'shortid';
import hash from 'object-hash';
import db from '../db.js';
import SwipesError from '../swipes-error';

const serviceDir = __dirname + '/../../services/';

const createSwipesShortUrl = ({ userId, accountId, link, meta = null }) => {
  const checksum = hash({ link });
  const shortUrl = shortid.generate();

  return fetchSwipesUrlData({userId, accountId, link, meta})
    .then((shortUrlData) => {
      const insertDoc = Object.assign({}, {checksum, short_url: shortUrl}, shortUrlData);
      const insertLinkQ =
        r.table('links')
          .insert(insertDoc, {
            returnChanges: 'always',
            conflict: (id, oldDoc, newDoc) => {
              return r.branch(
                r.expr(meta).ne(null),
                oldDoc,
                oldDoc.merge({
                  last_updated: r.now(),
                  service_data: newDoc('service_data'),
                  service_actions: newDoc('service_actions')
                })
              )
          	}
          });

      return db.rethinkQuery(insertLinkQ);
    })
    .then((result) => {
      const changes = result.changes[0];
      const shortUrl = changes.new_val.short_url;
      const serviceData = changes.new_val.service_data;

      return Promise.resolve({shortUrl, serviceData});
    })
    .catch((err) => {
      return Promise.reject(err);
    })
}

const fetchSwipesUrlData = ({userId, accountId, link, meta = null}) => {
  if (meta) {
    const shortUrlData = Object.assign({}, link, {
      service_data: meta.data || [],
      service_actions: meta.actions || []
    });

    return Promise.resolve(shortUrlData);
  }

  const serviceName = link.service;
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

  let userServiceData = null;
  let serviceData = null;

  return db.rethinkQuery(getServiceQ)
    .then((data) => {
      // T_TODO handle if there is no authed service in the user record
      // or there is no user anymore
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
    		itemId: link.id,
    		user: {userId},
    		service: {serviceId: accountId},
        type: link.type
    	};

      if (!file.shareRequest) {
        return Promise.reject('The service does not support swipes card yet');
      }

      return new Promise((resolve, reject) => {
        file.shareRequest(options, function (err, result) {
      		if (err) {
            return reject(err);
      		}

          const shortUrlData = Object.assign({}, link, {
            service_data: result.serviceData,
            service_actions: result.serviceActions
          });

          return resolve(shortUrlData);
      	});
      })
    })
    .catch((err) => {
      return Promise.reject(err);
    })
}

// T_TODO how to make the permissions table better
// The problem that we have with the current approach is that
// that shortUrl/userId are not enough to retrieve the right permissions
// because a user can share the same item with two different accountIds

// .then((result) => {
//   const link_id = result.generated_keys[0];
//   const checkQ =
//     r.table('link_rels')
//       .getAll(link_id, {index: 'link_id'})
//       .map((link) => {
//         return link('user_id')
//       })
//       .contains(userId)
//
//
//   db.rethinkQuery(checkQ)
//     .then((rels) => {
//       if (rels) {
//         return Promise.resolve();
//       } else {
//         const linkRelQ = r.table('link_rels').insert({
//           link_id,
//           user_id: userId,
//           account_id: accountId
//         });
//
//         return db.rethinkQuery(linkRelQ);
//       }
//     })
//     .catch((err) => {
//       return Promise.reject(err);
//     })
// })

export {
  createSwipesShortUrl,
  fetchSwipesUrlData
}
