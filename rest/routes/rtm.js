"use strict";

let config = require('config');
let express = require( 'express' );
let r = require('rethinkdb');
let util = require('../util.js');
let db = require('../db.js');
let Promise = require('bluebird');
let _ = require('underscore');

let router = express.Router();


router.post('/rtm.start', (req, res, next) => {
  let userId = req.userId;
  let isAdmin = req.isAdmin;

  //let meQ = r.table('users').get(userId).without(['password', 'workflows', {'services': "authData"}]);
  let meQ = r.table('users').get(userId).without(['password']);

  let users = r.table('users').without(["password", "services", "workflows", "xendoCredentials"]);

  // K_TODO: also only add
  let servicesQ = r.table('services');

  let workflowsQ = r.table('users')
                  .get(userId)('workflows').default([])
                  .eqJoin('parent_id', r.table('workflows'))
                  .without({right: ['id', 'name']}) // No id, nor name from the original service.
                  .zip();

  let activityQ = r.table('events')
                  .filter((e) => {
                    return e('user_id').eq(userId).and(e('type').eq('activity_added'))
                  })
                  .orderBy(r.desc('date'))
                  .without(['id', 'user_id', 'type'])

  let templatesQ = r.table('templates').orderBy('title');

  let promiseArrayQ = [
    db.rethinkQuery(meQ),
    db.rethinkQuery(users),
    db.rethinkQuery(workflowsQ),
    db.rethinkQuery(servicesQ),
    db.rethinkQuery(activityQ),
    db.rethinkQuery(templatesQ)
  ]

  Promise.all(promiseArrayQ)
    .then(data => {
      let rtmResponse = {
        ok: true,
        url: config.get('clientPort') === '443' ?
            config.get('origin') :
            config.get('origin') + ':' + config.get('clientPort'),
        workflow_base_url: config.get('clientPort') === '443' ?
                          config.get('origin')  + '/workflows/' :
                          config.get('origin') + ':' + config.get('clientPort')  + '/workflows/',
        self: data[0],
        users: data[1],
        workflows: data[2],
        services: data[3],
        activity: data[4],
        templates: data[5]
      }

      res.status(200).json(rtmResponse);
    }).catch(err => {
      return next(err);
    })
})

module.exports = router;
