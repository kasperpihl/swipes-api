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

  let meQ =
    r.table('users')
      .get(userId)
      .without(['password', 'xendoCredentials'/*, {'services': 'authData'}*/])
      .merge({
        organizations:
          r.table('organizations')
            .getAll(r.args(r.row("organizations")))
            .coerceTo('ARRAY')
      })
      .do((user) => {
        return user.merge({
          goals:
            r.table('goals')
              .getAll(user('organizations')(0)('id'), {index: 'organization_id'})
              .coerceTo('ARRAY')
        })
      })
      .do((user) => {
        return user.merge({
          organizations: user('organizations').map((organization) => {
            return organization.merge({
            users:
    					r.table('users')
                .getAll(r.args(organization("users")))
          			.without('password', 'organizations', 'services', 'xendoCredentials')
                .coerceTo('ARRAY')
            })
          })
        })
      })

  //let users = r.table('users').without(["password", "services", "workflows", "xendoCredentials"]);

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
                  .limit(100);

  let processesQ = r.table('processes').orderBy('title');

  let promiseArrayQ = [
    db.rethinkQuery(meQ),
    db.rethinkQuery(workflowsQ),
    db.rethinkQuery(servicesQ),
    db.rethinkQuery(activityQ),
    db.rethinkQuery(processesQ)
  ]

  Promise.all(promiseArrayQ)
    .then(data => {
      const self = data[0];
      let users = [];
      let goals = [];

      if (self.organizations.length > 0) {
        users = self.organizations[0].users;

        // We don't want duplication of that data served on the client;
        delete self.organizations[0].users;
      }

      if (self.goals.length > 0) {
        goals = self.goals;

        // We don't want duplication of that data served on the client;
        delete self.goals;
      }

      let rtmResponse = {
        ok: true,
        url: config.get('clientPort') === '443' ?
            config.get('origin') :
            config.get('origin') + ':' + config.get('clientPort'),
        workflow_base_url: config.get('clientPort') === '443' ?
                          config.get('origin')  + '/workflows/' :
                          config.get('origin') + ':' + config.get('clientPort')  + '/workflows/',
        self,
        users,
        goals,
        workflows: data[1],
        services: data[2],
        activity: data[3],
        processes: data[4]
      }

      res.status(200).json(rtmResponse);
    }).catch(err => {
      return next(err);
    })
})

module.exports = router;
