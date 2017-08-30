import {
  string,
  object,
  array,
  date,
  funcWrap,
} from 'valjs';
import {
  generateSlackLikeId,
} from '../../utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const attachmentsCreateAttachment = funcWrap([
  object.as({
    user_id: string.require(),
    title: string.require(),
    link: object,
    text: object,
  }),
], (err, {
  user_id,
  title,
  text,
  link = {},
}) => {
  if (err) {
    throw new SwipesError(`attachmentsCreateAttachment: ${err}`);
  }

  const attachment = {
    title,
    link,
    id: generateSlackLikeId('', 6),
    updated_at: new Date(),
    created_at: new Date(),
    created_by: user_id,
    updated_by: user_id,
  };

  if (text) {
    attachment.text = text;
  }

  return attachment;
});
const stepsCreateStep = funcWrap([
  object.as({
    user_id: string.require(),
    title: string.require(),
    assignees: array.require(),
    completed_at: date,
  }),
], (err, {
  user_id,
  title,
  assignees,
  completed_at,
}) => {
  if (err) {
    throw new SwipesError(`stepsCreateStep: ${err}`);
  }

  const step = {
    title,
    assignees,
    id: generateSlackLikeId('', 6),
    updated_at: new Date(),
    created_at: new Date(),
    created_by: user_id,
    updated_by: user_id,
    completed_at: completed_at || null,
  };

  return step;
});
const organizationConcatUsers = (locals) => {
  const organization = locals.organization;
  const active_users = organization.active_users;
  const disabled_users = organization.disabled_users || [];
  const pending_users = organization.pending_users || [];

  organization.users = active_users.concat(disabled_users).concat(pending_users);

  return organization;
};

export {
  attachmentsCreateAttachment,
  stepsCreateStep,
  organizationConcatUsers,
};
