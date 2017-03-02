import express from 'express';
import {
  string,
  array,
} from 'valjs';
import {
  tokensGetByUserId,
  tokensRevoke,
  tokensRevokeQueueMessage,
} from './middlewares/tokens';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/tokens.list',
  tokensGetByUserId,
  valResponseAndSend({
    tokens: array.require(),
  }));

authed.all('/tokens.revoke',
  valBody({
    token_to_revoke: string.require(),
  }),
  tokensRevoke,
  tokensRevokeQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    token: string.require(),
  }));

export {
  authed,
  notAuthed,
};
