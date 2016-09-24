"use strict";

const express = require('express');

const router = express.Router();

const fetchGoal = () => {}

router.post('/goals.do', (req, res, next) => {
  const action = req.body.action;
  /*
    action.type
    action.payload
   */
  const goalId = req.body.goalId;

  const goal = fetchGoal(goalId);
  let folder;
  let file;
  if(goal.type === 'deliver'){
    folder = 'deliver';
    if(goal.subtype === 'collection'){
      file = 'collection.js';
    }
  }
  const loadedFile = require('../reducers/' + folder + '/' + file);
  const existingData = goal.data;
  let newData = loadedFile.do(existingData, action);

  //rethinkdb.save(goal, newData);
});

module.exports = router;
