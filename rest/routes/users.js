"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let db = require('../db.js');
let util = require('../util.js');
let utilDB = require('../util_db.js');
let Promise = require('bluebird');
let SwipesError = require( '../swipes-error' );

let router = express.Router();
let generateId = util.generateSlackLikeId;

router.post('/users.me', (req, res, next) =>{
  let meQ = r.table('users').get(req.userId).without('password');
   db.rethinkQuery(meQ)
    .then((results) => {
        return res.status(200).json({ok: true, user: results});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/users.list', (req, res, next) => {
  let query = r.table('users').pluck('name', 'id', 'email', 'created', 'profile');

  db.rethinkQuery(query)
    .then((results) => {
        return res.status(200).json({ok: true, results: results});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/users.activateWorkflow', (req, res, next) => {
  let userId = req.userId;
  // T: I'm not sure if this is right but it will be more easy for us to make requests
  // especially on different servers. We can change it with id whenever we want
  let manifestId = req.body.manifest_id;
  // T: Optional param mainly for initial settings. I'm not even sure if we need it.
  let settings = req.body.settings || {};
  let getWorkflowQ =
    r.table('workflows')
      .filter((wf) => {
        return wf('manifest_id').eq(manifestId)
      })
      .nth(0).default(null);

  db.rethinkQuery(getWorkflowQ)
    .then((workflow) => {
      if (!workflow) {
        return Promise.reject(new SwipesError('workflow_not_found'));
      }

      let appendWorkflowQ =
        r.table('users')
          .get(userId)
          .update((user) => {
            return {
              workflows: user('workflows').default([]).append({
                id: generateId('W'),
                parent_id: workflow.id,
                name: workflow.name,
                settings: settings
              })
            }
          });

      return db.rethinkQuery(appendWorkflowQ);
    })
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/users.deactivateWorkflow', (req, res, next) => {
  let userId = req.userId;
  let workflow_id = req.body.workflow_id;

  if (!workflow_id) {
    return next(new SwipesError('workflow_id_required'));
  }

  let updateQ =
    r.table('users')
      .get(userId)
      .update((user) => {
        return {
          workflows: user('workflows').filter((wf) => {
            return wf('id').ne(workflow_id);
          })
        }
      });

  db.rethinkQuery(updateQ)
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/users.renameWorkflow', (req, res, next) => {
  let userId = req.userId;
  let workflowId = req.body.workflow_id;
  let name = req.body.name;
  let updateQ = utilDB.updateUserWorkflowsQ(userId, workflowId, {name: name});

  if (!workflowId || !name) {
    return next(new SwipesError('workflow_id_and_name_required'));
  }

  db.rethinkQuery(updateQ)
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/users.settingsWorkflow', (req, res, next) => {
  let userId = req.userId;
  let workflowId = req.body.workflow_id;
  let settings = req.body.settings;
  let updateQ = utilDB.updateUserWorkflowsQ(userId, workflowId, {settings: settings});

  if (!workflowId || !settings) {
    return next(new SwipesError('workflow_id_and_settings_required'));
  }

  db.rethinkQuery(updateQ)
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
});

module.exports = router;
