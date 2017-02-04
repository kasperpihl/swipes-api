import express from 'express';
import {
  string,
} from 'valjs';
import {
  tempStreamingLinkGetSingle,
} from './middlewares/temp_streaming_links';
import {
  serviceImport,
  serviceWithAuthGet,
  serviceDoStream,
} from './middlewares/services';
import {
  valBody,
  valResponseAndSend,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/stream',
  valBody({
    id: string.require(),
  }),
  tempStreamingLinkGetSingle,
  serviceWithAuthGet,
  serviceImport,
  serviceDoStream,
);
  // valResponseAndSend({
  //   preview: object.require(),
  // }));

export {
  authed,
  notAuthed,
};
