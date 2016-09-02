"use strict";

import r from 'rethinkdb';
import db from '../db.js';

const serviceDir = __dirname + '/../../services/';

/*
  T
  The first step of processing a webhook should be delegated to the services.
  I just want to implement more than 3 webhooks here and then decide
  what is the correct way to generalize it.
*/
const processWebhookMessage = (req, res, next) => {
  const service = res.locals.service;
  const message = res.locals.message;

  //console.log(res.locals.message);

  if (service === 'dropbox') {
    const accounts = message.list_folder.accounts;
    // Need to find the access tokens for all the accounts that match our database
    const getAuthDataQ =
      r.table('users')
        .concatMap((user) => {
          return user('services').merge({user_id: user('id')})
	      }).filter((service) => {
          return r.contains(accounts, service('id'))
        })

    db.rethinkQuery(getAuthDataQ)
      .then((accountsAuthData) => {
        // Pass that to the service to provide us with the event data.
        let file;

      	try {
      		file = require(serviceDir + service + '/' + service);
      	}
      	catch (e) {
      		console.log(e);
      	}

        accountsAuthData.forEach((accountAuthData) => {
          file.processWebhook(accountAuthData, (err, res) => {
            if (err) {
              console.log('ERROR Processing drobox webhook', err);
            }
          });
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  if (service === 'asana') {
    const {
      accountId,
      resourceId
    } = res.locals;

    const getAuthDataQ =
      r.table('users')
        .concatMap((user) => {
          return user('services').merge({user_id: user('id')})
	      }).filter((service) => {
          return service('id').eq(r.expr(accountId).coerceTo('number'));
        })

    db.rethinkQuery(getAuthDataQ)
      .then((accountsAuthData) => {
        // Pass that to the service to provide us with the event data.
        let file;

      	try {
      		file = require(serviceDir + service + '/' + service);
      	}
      	catch (e) {
      		console.log(e);
      	}

        accountsAuthData.forEach((accountAuthData) => {
          file.processWebhook(accountAuthData, resourceId, accountId, (err, res) => {
            if (err) {
              console.log('ERROR Processing asana webhook', err);
            }
          });
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  return next();
}

export {
  processWebhookMessage
}
