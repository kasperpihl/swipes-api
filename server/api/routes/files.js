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
} from './middlewares/files';
import {
  linksAddPermission,
  linksCreate,
} from './middlewares/links';
import {
  attachmentsCreate,
  attachmentsInsert,
  attachmentsAddQueueMessage,
} from './middlewares/attachments';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  service,
} from '../validators';

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

authed.all('/files.upload',
  valBody({
    target_id: string.require(),
    organization_id: string.require(),
    file_name: string.require(),
    s3_name: string.require(),
  }),
  filesAddToFilesTable,
  linksCreate,
  linksAddPermission,
  attachmentsCreate,
  attachmentsInsert,
  attachmentsAddQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    target_id: string.require(),
    attachment: object.as({
      id: string.require(),
      title: string.min(1).require(),
      created_at: date.require(),
      created_by: string.require(),
      updated_at: date.require(),
      updated_by: string.require(),
      link: object.as({
        service,
        permission: object.as({
          short_url: string.require(),
        }),
      }).require(),
    }).require(),
    attachment_order: array.require(),
  }),
 );

export {
  authed,
  notAuthed,
};
