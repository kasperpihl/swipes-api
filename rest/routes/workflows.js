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
let workflowsDir = __dirname + '/../../workflows/';

router.post('/workflows.list', (req, res, next) => {
  let workflowQ = r.table('workflows');

  db.rethinkQuery(workflowQ)
    .then((workflows) => {
      res.status(200).json({ok: true, data: workflows});
    }).catch((err) => {
      return next(err);
    });
});

router.post('/workflows.install', isAdmin, (req, res, next) => {
  let manifestId = req.body && req.body.manifest_id;

  if (!manifestId) {
    return next(new SwipesError('manifest_id_required'));
  }

  let getWorkFlowQ =
      r.table('workflows')
      .filter((wf) => {
        return wf('manifest_id')
          .eq(manifestId)
          .and(wf.hasFields('deleted').not())
      })
      .nth(0)
      .default(null);

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
        version: manifest.version
      };
      if(manifest.required_services){
        updateDoc.required_services = manifest.required_services;
      }
      if(manifest.domains){
        updateDoc.domains = manifest.domains;
      }
      if (manifest.index) {
        updateDoc.index = manifest.index;
      }
      if(manifest.icon){
        updateDoc.icon = manifest.icon;
      }
      if(manifest.external_url){
        updateDoc.external_url = manifest.external_url;
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
