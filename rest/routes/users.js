"use strict";

import express from 'express';
import r from 'rethinkdb';
import db from '../db.js';
import util from '../util.js';
import utilDB from '../util_db.js';
import Promise from 'bluebird';
import SwipesError from '../swipes-error';
import {
  getUserService,
  cleanupWebhooksFromUserService,
  usersGetXendoServiceId,
  usersRemoveXendoService,
  userRemoveService,
} from '../middlewares/users';
import {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoRemoveServiceFromUser
} from '../middlewares/xendo';

const router = express.Router();
const generateId = util.generateSlackLikeId;

router.post('/users.me', (req, res, next) =>{
  const meQ = r.table('users').get(req.userId).without('password');

   db.rethinkQuery(meQ)
    .then((results) => {
        return res.status(200).json({ok: true, user: results});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/users.list', (req, res, next) => {
  const query = r.table('users').pluck('name', 'id', 'email', 'created', 'profile');

  db.rethinkQuery(query)
    .then((results) => {
        return res.status(200).json({ok: true, results: results});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/users.addWorkflow', (req, res, next) => {
  const userId = req.userId;
  const manifestId = req.body.manifest_id;
  const settings = req.body.settings || {};
  const getWorkflowQ =
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
                id: generateId('C'),
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

router.post('/users.removeWorkflow', (req, res, next) => {
  const userId = req.userId;
  const workflow_id = req.body.workflow_id;

  if (!workflow_id) {
    return next(new SwipesError('workflow_id_required'));
  }

  const updateQ =
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
  const userId = req.userId;
  const workflowId = req.body.workflow_id;
  const name = req.body.name;

  if (!workflowId || !name) {
    return next(new SwipesError('workflow_id_and_name_required'));
  }

  const updateQ = utilDB.updateUserWorkflowsQ(userId, workflowId, {name: name});

  db.rethinkQuery(updateQ)
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/users.selectWorkflowAccountId', (req, res, next) => {
  const userId = req.userId;
  const workflowId = req.body.workflow_id;
  const accountId = req.body.account_id;

  if(!workflowId || !accountId){
    return next(new SwipesError('workflow_id_and_account_id_required'));
  }

  const updateQ = utilDB.updateUserWorkflowsQ(userId, workflowId, {selectedAccountId: accountId});

  db.rethinkQuery(updateQ)
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
})

router.post('/users.updateWorkflowSettings', (req, res, next) => {
  const userId = req.userId;
  const workflowId = req.body.workflow_id;
  const settings = req.body.settings;

  if (!workflowId || !settings) {
    return next(new SwipesError('workflow_id_and_settings_required'));
  }

  const updateQ = utilDB.updateUserWorkflowsQ(userId, workflowId, {settings: settings});

  db.rethinkQuery(updateQ)
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
});

router.post('/users.serviceDisconnect',
  getUserService,
  cleanupWebhooksFromUserService,
  usersGetXendoServiceId,
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoRemoveServiceFromUser,
  usersRemoveXendoService,
  userRemoveService,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  });

module.exports = router;
