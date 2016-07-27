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

  console.log(res.locals.message);

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

        file.processWebhook(accountsAuthData, (error, result) => {
          if (error) {
            console.log(error);
          } else {
            console.log(result);
          }
        })
      })
      .catch((error) => {
        // T_TODO log errors from proccesing webhooks.
        // We return 200 OK to the webhook server because we received the message
        // Everything else is our problem and we should just log the error somewhere
        console.log(error);
      })
  }

  return next();
}

export {
  processWebhookMessage
}
