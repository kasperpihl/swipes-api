"use strict";

import express from 'express';
import {
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults
} from '../middlewares/xendo.js';

const router = express.Router();

router.post('/search',
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults,
  (req, res, next) => {
    return res.status(200).json({ok: true, result: res.locals.mappedResults});
  }
)

module.exports = router;
