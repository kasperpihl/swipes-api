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
} from './middlewares/attachments';
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
  valResponseAndSend({
    target_id: string.require(),
    attachment: object.require(),
    attachment_order: array.require(),
  }));
// Event: attachment_added


authed.all('/attachments.rename',
  valBody({
    target_id: string.require(),
    attachment_id: string.require(),
    title: string.min(1).require(),
  }),
  attachmentsRename,
  valResponseAndSend({
    target_id: string.require(),
    attachment_id: string.require(),
    title: string.min(1).require(),
  }));
// Event: attachment_renamed

authed.all('/attachments.delete',
  valBody({
    target_id: string.require(),
    attachment_id: string.require(),
  }),
  attachmentsDelete,
  valResponseAndSend({
    target_id: string.require(),
    attachment_id: string.require(),
  }));
// Event: attachment_deleted

authed.all('/attachments.reorder',
  valBody({
    target_id: string.require(),
    attachment_order: array.require(),
  }),
  attachmentsReorder,
  valResponseAndSend({
    target_id: string.require(),
    attachment_order: array.require(),
  }));
// Event: attachment_reordered

export {
  authed,
  notAuthed,
};
