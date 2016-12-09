import {
  validatorMiddleware,
} from './validation-wrapper';
import {
  isArray,
} from './common';

const notification_ids = Object.assign({}, isArray, {
  presence: true,
});
const validateNotificationsMarkAsSeen = validatorMiddleware({
  notification_ids,
});

export {
  validateNotificationsMarkAsSeen,
};
