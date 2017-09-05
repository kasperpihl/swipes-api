import express from 'express';
import {
  string,
  object,
  array,
  date,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  filesGetSignedUrl,
  filesAddToFilesTable,
  filesCreateS3Path,
} from './middlewares/files';

import {
  service,
} from '../validators';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/files.signedUrl',
  valBody({
    organization_id: string.require(),
    file_name: string.require(),
    file_type: string.require(),
  }),
  filesCreateS3Path,
  filesGetSignedUrl,
  valResponseAndSend({
    s3_url: string.require(),
    signed_url: string.require(),
  }));

authed.all('/files.create',
 valBody({
   organization_id: string.require(),
   file_name: string.require(),
   s3_url: string.require(),
 }),
 filesAddToFilesTable,
 valResponseAndSend({
   file: object.as({
     id: string.require(),
     title: string.require(),
   }).require(),
 }),
);

export {
  authed,
  notAuthed,
};
