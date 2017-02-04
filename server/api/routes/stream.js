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
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/stream',
  valBody({
    id: string.require(),
  }),
  tempStreamingLinkGetSingle,
  // (req, res, next) => {
  //   const {
  //     urlData,
  //   } = res.locals;
  //
  //   res.set('Content-Type', urlData.metadata.mimeType);
  //   res.set('Content-Disposition', `attachment; filename="${urlData.metadata.name}"`);
  //
  //   return next();
  // },
  serviceWithAuthGet,
  serviceImport,
  serviceDoStream,
);

export {
  authed,
  notAuthed,
};
