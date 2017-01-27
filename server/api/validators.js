import {
  string,
  object,
  array,
  bool,
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

const goalFullMoreStrict =
    object.as({
      id: string.require(),
      organization_id: string.require(),
      title: string.require(),
      steps: object.of(object.as({
        id: string.require(),
        title: string.require(),
        assignees: array.of(string).require(),
      })).require(),
      step_order: array.of(string).require(),
      attachments: object.require(),
      attachment_order: array.of(string).require(),
      archived: bool.require(),
      // T_TODO history and status can be described even deeper
      history: array.of(object).require(),
      status: object.require(),
      created_by: string.require(),
      // T_TODO cover the dates someday
      // created_at;
      // updated_at;
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
  goalFullMoreStrict,
};
