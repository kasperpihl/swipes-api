import {
  validatorMiddleware,
} from './validation-wrapper';

const notification_ids = {
  presence: true,
};
const validateNotificationsMarkAsSeen = validatorMiddleware({
  notification_ids,
});

export {
  validateNotificationsMarkAsSeen,
};
