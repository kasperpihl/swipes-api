"use strict";

let express = require( 'express' );
let Promise = require('bluebird');
let fs = require('fs');
let r = require('rethinkdb');
let config = require('config');
let db = require('../db.js');
let util = require('../util.js');
let SwipesError = require( '../swipes-error' );

let router = express.Router();
let generateId = util.generateSlackLikeId;
let isAdmin = util.isAdmin;

// Relative directory to installed workflows
// T_TODO Change the folder to workflows
let workflowsDir = __dirname + '/../../apps/';

router.post('/workflows.install', isAdmin, (req, res, next) => {
  let workflowId = req.body && req.body.workflow_id;
  let manifestId = req.body && req.body.manifest_id;

  if (!workflowId && !manifestId) {
    return next(new SwipesError('workflow_id_or_manifest_id_required'));
  }

  let getWorkFlowQ;

  if (workflowId) {
    getWorkFlowQ = r.table('workflows').get(workflowId);
  } else {
    getWorkFlowQ =
      r.table('workflows')
      .filter((wf) => {
        return wf('manifest_id')
          .eq(manifestId)
          .and(wf.hasFields('deleted').not())
      })
      .nth(0)
      .default(null);
  }

  let workflow, manifest;

  db.rethinkQuery(getWorkFlowQ)
    .then((workflow) => {
      if (!manifestId && !workflow)  {
        return Promise.reject(SwipesError('workflow_not_found'));
      }

      manifest = JSON.parse(util.getFile(workflowsDir + manifestId + '/manifest.json'));

      if (!manifest) {
        return Promise.reject(SwipesError('manifest_not_found'));
      }

      if (!workflow) {
        workflow = {};
      }

      // Prepare for upsert
      let updateDoc = {
        id: workflow.id || generateId('W'),
        name: manifest.name,
        manifest_id: manifestId,
        description: manifest.description,
        version: manifest.version,
        is_installed: true
      };

      if (manifest.main_app) {
        updateDoc.main_app = manifest.main_app;
      }

      if (manifest.preview_app) {
        updateDoc.preview_app = manifest.preview_app;
      }

      return db.rethinkQuery(r.table('workflows').insert(updateDoc, {'conflict': 'update'}));
  })
  .then(() => {
    res.status(200).json({ok: true});
  })
  .catch((err) => {
    return next(err);
  })
});

module.exports = router;
