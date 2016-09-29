"use strict";

import express from 'express';
import r from 'rethinkdb';
import db from '../db.js';
import {
  goalsValidate,
  goalsCreate
} from '../middlewares/goals';

const router = express.Router();

router.post('/goals.processes', (req, res, next) => {
  const q = r.table('processes').orderBy('title');

  return db.rethinkQuery(q)
    .then((processes) => {
      return res.status(200).json({ok: true, data: processes});
    })
    .catch((err) => {
      return next(err);
    })
})

router.post('/goals.add', goalsValidate, goalsCreate, (req, res, next) => {
  return res.status(200).json({ok: true});
})

module.exports = router;


// "use strict";
//
// const express = require('express');
//
// const router = express.Router();
//
// const fetchGoal = () => {}
//
// router.post('/goals.do', (req, res, next) => {
//   const action = req.body.action;
//   /*
//     action.type
//     action.payload
//    */
//   const goalId = req.body.goalId;
//
//   const goal = fetchGoal(goalId);
//   let folder;
//   let file;
//   if(goal.type === 'deliver'){
//     folder = 'deliver';
//     if(goal.subtype === 'collection'){
//       file = 'collection.js';
//     }
//   }
//   const loadedFile = require('../reducers/' + folder + '/' + file);
//   const existingData = goal.data;
//   let newData = loadedFile.do(existingData, action);
//
//   //rethinkdb.save(goal, newData);
// });
//
// module.exports = router;
