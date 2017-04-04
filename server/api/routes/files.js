import express from 'express';
import {
  string,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  filesGetSignedUrl,
} from './middlewares/files';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/files.signedUrl',
  valBody({
    file_name: string.require(),
    file_type: string.require(),
  }),
  filesGetSignedUrl,
  valResponseAndSend({
    signed_url: string.require(),
  }));

export {
  authed,
  notAuthed,
};
