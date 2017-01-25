import express from 'express';
import {
  string,
  object,
} from 'valjs';
import {
  serviceIdGet,
  serviceImport,
  serviceGetAuthUrl,
  serviceWithAuthGet,
  serviceDoRequest,
  serviceGetAuthData,
  serviceUpdateAuthData,
} from './middlewares/services';
import {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoAddServiceToUser,
} from './middlewares/xendo';
import {
  valBody,
  valResponseAndSend,
  sendResponse,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/services.authorize',
  valBody({
    service_name: string.require(),
  }),
  serviceImport,
  serviceGetAuthUrl,
  (req, res) => {
    const {
      returnObj,
    } = res.locals;

    res.writeHead(302, { Location: returnObj.authUrl });
    res.end();
  });

authed.all('/services.request',
  valBody({
    service_name: string.require(),
    account_id: string.require(),
    method: object.as({
      method: string.require(),
      parameters: object.require(),
    }),
  }),
  serviceWithAuthGet,
  serviceImport,
  serviceDoRequest,
  // T_TODO Kasper fix this on client
  valResponseAndSend({
    result: object.require(),
  }));

authed.all('/services.authsuccess',
  valBody({
    service_name: string.require(),
    query: object.require(),
  }),
  serviceIdGet,
  serviceImport,
  serviceGetAuthData,
  serviceUpdateAuthData,
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoAddServiceToUser,
  sendResponse,
);

export {
  notAuthed,
  authed,
};
