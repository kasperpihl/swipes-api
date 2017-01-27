import {
  string,
  object,
  array,
} from 'valjs';

const goalMoreStrict =
  object.as({
    title: string.require(),
    steps: object.of(object.as({
      id: string.require(),
      title: string.require(),
      assignees: array.of(string).require(),
    })).require(),
    step_order: array.of(string).require(),
    attachments: object.require(),
    attachment_order: array.of(string).require(),
  }).require();

const goalLessStrict =
  object.as({
    title: string,
    steps: object.of(object.as({
      id: string,
      title: string,
      assignees: array.of(string),
    })),
    step_order: array.of(string),
    attachments: object,
    attachment_order: array.of(string),
  }).require();

const service =
  object.as({
    id: string.require(),
    name: string.require(),
    type: string.require(),
  }).require();

const linkPermission =
  object.as({
    account_id: string.require(),
  }).require();

const linkMeta =
  object.as({
    title: string.require(),
  }).require();

export {
  goalMoreStrict,
  goalLessStrict,
  service,
  linkPermission,
  linkMeta,
};
