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


const authed = express.Router();
const notAuthed = express.Router();

authed.all('/attachments.add',
  valBody({
    target: string.require(),
    attachment: object.require(),
  }),

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

  valResponseAndSend({
    target: string.require(),
    attachment_order: array.require(),
  }));
// Event: attachment_reordered

export {
  authed,
  notAuthed,
};
