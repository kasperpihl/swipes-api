"use strict";

import express from 'express';
import {
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults
} from './middlewares/xendo.js';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/search',
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults,
  (req, res, next) => {
    return res.status(200).json({ok: true, result: res.locals.mappedResults});
  })

export {
  notAuthed,
  authed
}
