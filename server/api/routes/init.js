"use strict";

import express from 'express';
import config from 'config';
import {
  initGetData
} from './middlewares/init';

const authed = express.Router();
const notAuthed = express.Router();

// !T_TODO Change rtm.start to init before shipping the new server
authed.all('/rtm.start',
  initGetData,
  (req, res, next) => {
    res.send(res.locals.initData);
  })

export {
  notAuthed,
  authed
}
