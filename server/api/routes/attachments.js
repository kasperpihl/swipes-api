import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  linksAddPermission,
  linksCreate,
} from './middlewares/links';
import {
  attachmentsAdd,
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
  linkPermission,
  linkMeta,
} from '../validators';


const authed = express.Router();
const notAuthed = express.Router();

authed.all('/attachments.add',
  valBody({
    target_id: string.require(),
    link: object.as({
      service,
      permission: linkPermission,
      meta: linkMeta,
    }).require(),
  }),
  linksCreate,
  linksAddPermission,
  attachmentsAdd,
  attachmentsAddQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    target_id: string.require(),
    attachment: object.as({
      id: string.require(),
      created_at: string.format('iso8601').require(),
      created_by: string.require(),
      updated_at: string.format('iso8601').require(),
      updated_by: string.require(),
      link: object.as({
        service,
        permission: object.as({
          short_url: string.require(),
        }),
        meta: linkMeta,
      }).require(),
    }).require(),
    attachment_order: array.require(),
  }));

authed.all('/attachments.rename',
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
  }));

authed.all('/attachments.delete',
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
  }));

authed.all('/attachments.reorder',
  valBody({
    target_id: string.require(),
    attachment_order: array.require(),
  }),
  attachmentsReorder,
  attachmentsReorderQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    target_id: string.require(),
    attachment_order: array.require(),
  }));

export {
  authed,
  notAuthed,
};
