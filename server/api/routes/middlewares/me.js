import {
  string,
  object,
} from 'valjs';
import {
  dbMeUpdateSettings,
} from './db_utils/me';
import {
  valLocals,
} from '../../utils';

const meUpdateSettings = valLocals('meUpdateSettings', {
  user_id: string.require(),
  settings: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    settings,
  } = res.locals;

  dbMeUpdateSettings({ user_id, settings })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const meUpdateSettingsQueueMessage = valLocals('meUpdateSettingsQueueMessage', {
  user_id: string.require(),
  settings: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    settings,
  } = res.locals;
  const queueMessage = {
    user_id,
    settings,
    event_type: 'settings_updated',
  };

  setLocals({
    queueMessage,
    messageGroupId: user_id,
  });

  return next();
});

export {
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
};
