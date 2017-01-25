import express from 'express';
import {
  string,
  array,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults,
} from './middlewares/xendo';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/search',
  valBody({
    q: string.require(),
  }),
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults,
  valResponseAndSend({
    mappedResults: array.require(),
  }));

export {
  notAuthed,
  authed,
};
