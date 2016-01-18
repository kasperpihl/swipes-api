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

  let meQ = r.table('users').get(userId).without(['password', {'services': "authData"}]);

  let users = r.table('users').without(["password", "services", "workflows"]);

  // K_TODO: also only add 
  let servicesQ = r.table('services');
  
  // Workflows should contain only my added workflows / we should add the whole stack in /workflows.list
  let workflowQ = r.table('users')
                  .get(userId)('workflows')
                  .eqJoin('parent_id', r.table('workflows'), {index: 'id'})
                  .without({right: ['id', 'name']}) // No id, nor name from the original service.
                  .zip();

  let promiseArrayQ = [
    db.rethinkQuery(meQ),
    db.rethinkQuery(users),
    db.rethinkQuery(workflowQ),
    db.rethinkQuery(servicesQ)
  ]

  Promise.all(promiseArrayQ)
    .then(data => {
      let rtmResponse = {
        ok: true,
        url: config.get('hostname') + ':' + config.get('port'),
        workflow_base_url: config.get('hostname') + ':' + config.get('port') + '/workflows/',
        self: data[0],
        users: data[1],
        workflows: data[2],
        services: data[3]
      }

      res.status(200).json(rtmResponse);
    }).catch(err => {
      return next(err);
    })
})

module.exports = router;
