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
      authUrl,
    } = res.locals;

    res.writeHead(302, { Location: authUrl });
    res.end();
  });

authed.all('/services.request',
  valBody({
    service_name: string.require(),
    account_id: string.require(),
    method: string.require(),
    parameters: object.require(),
  }),
  serviceWithAuthGet,
  serviceImport,
  serviceDoRequest,
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
  valResponseAndSend,
);

export {
  notAuthed,
  authed,
};
