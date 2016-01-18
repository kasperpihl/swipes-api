"use strict";

let config = require('config');
let express = require( 'express' );
let r = require('rethinkdb');
let util = require('../util.js');
let db = require('../db.js');
let Promise = require('bluebird');
let _ = require('underscore');

let router = express.Router();

let getWorkflows = (userId, isAdmin, req) => {
  let filter;

  if (isAdmin) {
    filter = {is_installed: true};
  } else {
    filter = (wf) => {
      return wf('is_installed').eq(true).and(wf.hasFields('admin_only').not());
    }
  }

  let workflowsQ =
    r.table('workflows')
      .filter(filter)
      .without('is_installed')
      .coerceTo('Array');

  let userWorkflowsQ =
    r.table('users')
      .get(userId)('workflows')
      .default([]);

  let workflowsListQ =
    r.do(workflowsQ, userWorkflowsQ, (workflows, userWorkflows) => {
      return r.expr([workflows, userWorkflows])
    });

  return new Promise((resolve, reject) => {
    db.rethinkQuery(workflowsListQ)
      .then((results) => {
        let workflows = results[0];
        let userWorkflows = results[1];
        let response = [];

        workflows.forEach((wf) => {
          let len = userWorkflows.length;

          if(wf.preview_view) {
            wf.preview_app_url = util.workflowUrl(req, wf, "preview_app");
          }

          if(wf.main_app) {
            wf.main_app_url = util.workflowUrl(req, wf, "main_app");
          }

          for (let i=0; i<len; i++) {
            let userWf = userWorkflows[i];

            if (wf.id === userWf.parent_id) {
              response.push(_.extend(wf, userWf));

              break;
            }
          }

          if (wf.required) {
            response.push(wf);
          }
        })

        return resolve(response);
      })
      .catch((err) => {
        return reject(err);
      })
  })
}

router.post('/rtm.start', (req, res, next) => {
  let userId = req.userId;
  let isAdmin = req.isAdmin;

  let meQ = r.table('users').get(userId).without(['password', {'services': "authData"}]);

  let users = r.table('users').without(["password", "services", 'apps']);

  let servicesQ = r.table('services');

  let promiseArrayQ = [
    db.rethinkQuery(meQ),
    db.rethinkQuery(users),
    getWorkflows(userId, isAdmin, req),
    db.rethinkQuery(servicesQ)
  ]

  Promise.all(promiseArrayQ)
    .then(data => {
      let rtmResponse = {
        ok: true,
        url: config.get('hostname') + ':' + config.get('port'),
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
