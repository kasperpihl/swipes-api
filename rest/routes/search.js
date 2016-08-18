"use strict";

import express from 'express';
import {
  xendoUserCredentials,
  xendoRefreshUserToken,
  xendoSearch
} from '../middlewares/xendo.js';

const router = express.Router();

router.post('/search',
  xendoUserCredentials,
  xendoRefreshUserToken,
  xendoSearch,
  (req, res, next) => {
    return res.status(200).json({ok: true, result: res.locals.result});
  }
)

module.exports = router;
