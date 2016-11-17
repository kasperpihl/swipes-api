"use strict";

import express from 'express';
import {
  validateServicesAuthorize,
  validateServicesRequest,
  validateServicesAuthorizeSuccess
} from '../validators/services';
import {
  serviceIdGet,
  serviceImport,
  serviceGetAuthUrl,
  serviceWithAuthGet,
  serviceDoRequest,
  serviceGetAuthData,
  serviceUpdateAuthData
} from './middlewares/services';
import {
  xendoSwipesCredentials,
	xendoRefreshSwipesToken,
	xendoAddServiceToUser
} from './middlewares/xendo.js';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/services.authorize',
  validateServicesAuthorize,
  serviceImport,
  serviceGetAuthUrl,
  (req, res, next) => {
    const {
      authUrl
    } = res.locals;

    res.writeHead(302, {'Location': authUrl});
    res.end();
  })

authed.all('/services.request',
  validateServicesRequest,
  serviceWithAuthGet,
  serviceImport,
  serviceDoRequest,
  (req, res, next) => {
    const {
      service_request_result
    } = res.locals;

    res.send({ ok: true, data: service_request_result });
  })

authed.all('/services.authsuccess',
  validateServicesAuthorizeSuccess,
  serviceIdGet,
  serviceImport,
  serviceGetAuthData,
  serviceUpdateAuthData,
  xendoSwipesCredentials,
	xendoRefreshSwipesToken,
	xendoAddServiceToUser,
  (req, res, next) => {
    res.send({ ok: true });
  })

export {
  notAuthed,
  authed
}
