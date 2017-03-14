import * as a from 'actions';
import { valAction } from 'classes/utils';

import {
  object,
  array,
  string,
} from 'valjs';


export const add = valAction('attachments.add', [
  string.require(),
  object.as({
    service: object.as({
      id: string.require(),
      name: string.require(),
      type: string.require(),
    }).require(),
    meta: object.as({
      title: string.require(),
    }).require(),
    permission: object.as({
      account_id: string.require(),
    }).require(),
  }).require(),
], (targetId, link) => d => d(a.api.request('attachments.add', {
  target_id: targetId,
  link,
})));


export const rename = valAction('attachments.rename', [
  string.require(),
  string.require(),
  string.require(),
], (targetId, attachmentId, title) => d => d(a.api.request('attachments.rename', {
  target_id: targetId,
  attachment_id: attachmentId,
  title,
})));

export const remove = valAction('attachments.remove', [
  string.require(),
  string.require(),
], (targetId, attachmentId) => d => d(a.api.request('attachments.delete', {
  target_id: targetId,
  attachment_id: attachmentId,
})));

export const reorder = valAction('attachments.reorder', [
  string.require(),
  array.of(string).require(),
], (targetId, attachmentOrder) => d => d(a.api.request('attachments.reorder', {
  target_id: targetId,
  attachment_order: attachmentOrder,
})));
