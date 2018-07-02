import express from 'express';
import {
  string,
  object,
  array,
  date,
} from 'valjs';
import {
  attachmentsCreate,
  attachmentsInsert,
  attachmentsRename,
  attachmentsDelete,
  attachmentsReorder,
  attachmentsAddQueueMessage,
  attachmentsRenameQueueMessage,
  attachmentsDeleteQueueMessage,
  attachmentsReorderQueueMessage,
} from './middlewares/attachments';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  service,
  linkMeta,
} from '../validators';


const authed = express.Router();
const notAuthed = express.Router();

authed.all(
  '/attachments.add',
  valBody({
    target_id: string.require(),
    link: object.as({
      service,
      permission: object.as({
        short_url: string.require(),
      }),
      meta: linkMeta,
    }).require(),
    title: string,
  }),
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

authed.all(
  '/attachments.rename',
  valBody({
    target_id: string.require(),
    attachment_id: string.require(),
    title: string.min(1).require(),
  }),
  attachmentsRename,
  attachmentsRenameQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    target_id: string.require(),
    attachment_id: string.require(),
    title: string.min(1).require(),
  }),
);

authed.all(
  '/attachments.delete',
  valBody({
    target_id: string.require(),
    attachment_id: string.require(),
  }),
  attachmentsDelete,
  attachmentsDeleteQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    target_id: string.require(),
    attachment_id: string.require(),
  }),
);

authed.all(
  '/attachments.reorder',
  valBody({
    target_id: string.require(),
    attachment_order: array.of(string).require(),
  }),
  attachmentsReorder,
  attachmentsReorderQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    target_id: string.require(),
    attachment_order: array.of(string).require(),
  }),
);

export {
  authed,
  notAuthed,
};