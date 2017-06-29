import {
  string,
  object,
  array,
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
  }),
], (err, {
  user_id,
  title,
  assignees,
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
    completed_at: null,
  };

  return step;
});

export {
  attachmentsCreateAttachment,
  stepsCreateStep,
};