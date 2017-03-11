import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
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
    target: string.require(),
    link: object.as({
      service,
      permission: linkPermission,
      meta: linkMeta,
    }).require(),
  }),
  /*
    T_TODO:
    [] create link
    [] add attachment to attachments object (indexed by id)
    [] add created_at to the attachment object
    [] add created_by to the attachment object
    [] update goal.updated_at
    [] add id to attachment_order
  */
  valResponseAndSend({
    target: string.require(),
    attachment: object.require(),
    attachment_order: array.require(),
  }));
// Event: attachment_added


authed.all('/attachments.rename',
  valBody({
    target: string.require(),
    attachment_id: string.require(),
    title: string.require().min(1),
  }),
  /*
    T_TODO:
    [] rename attachments[attachment_id].title
    [] update goal.updated_at
  */
  valResponseAndSend({
    target: string.require(),
    attachment_id: string.require(),
    title: string.require(),
  }));
// Event: attachment_renamed

authed.all('/attachments.delete',
  valBody({
    target: string.require(),
    attachment_id: string.require(),
  }),
  /*
    T_TODO:
    [] add deleted: true to attachments[attachment_id]
    [] update goal.updated_at
    [] remove attachment_id from attachment_order
  */
  valResponseAndSend({
    target: string.require(),
    attachment_id: string.require(),
  }));
// Event: attachment_deleted

authed.all('/attachments.reorder',
  valBody({
    target: string.require(),
    attachment_order: array.require(),
  }),
  /*
    T_TODO:
    [] update the attachment_order array with new value
    [] update goal.updated_at
    [] check that all attachments with !deleted is part of attachment_order array
    [] insert any !deleted attachments that is not part to the end of the attachment_order array
  */
  valResponseAndSend({
    target: string.require(),
    attachment_order: array.require(),
  }));
// Event: attachment_reordered

export {
  authed,
  notAuthed,
};
