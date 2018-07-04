import express from 'express';
import {
  string,
  object,
  array,
  any,
} from 'valjs';
import {
  serviceIdGet,
  serviceImport,
  serviceGetAuthUrl,
  serviceWithAuthGet,
  serviceDoRequest,
  serviceGetAuthData,
  serviceUpdateAuthData,
  serviceAuthCheck,
} from './middlewares/services';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
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
    result: any.of(object, array),
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
  notificationsPushToQueue,
  valResponseAndSend(),
);

notAuthed.all('/services.authcheck',
  valBody({
    service_name: string.require(),
    credentials: object.require(),
  }),
  serviceImport,
  serviceAuthCheck,
  valResponseAndSend({
    result: object.require(),
  }));

export {
  notAuthed,
  authed,
};
