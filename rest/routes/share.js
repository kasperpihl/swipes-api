"use strict";

const config = require('config');
const express = require('express');
const r = require('rethinkdb');
const Promise = require('bluebird');
const db = require('../db.js');
const SwipesError = require('../swipes-error');
const serviceDir = __dirname + '/../../services/';
const router = express.Router();

router.get('/share.url', (req, res, next) => {
  const shareId = req.query.shareId;
  // T_TODO: Provide accessable data in a request
})