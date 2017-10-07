import config from 'config';
import Mailchimp from 'mailchimp-api-v3';
import Promise from 'bluebird';
import {
  dbUsersGetSingleWithOrganizations,
  dbUsersGetMultipleWithFields,
} from '../db_utils/users';

const mailChimpListIds = [
  '83f9136e88',
  'f5a33f6905',
];
const mailChimpConf = config.get('mailchimp');
const mailchimp = new Mailchimp(mailChimpConf.apiKey);
const usersGetSingleWithOrganizations = (req, res, next) => {
  const {
    user_id,
  } = res.locals;

  return dbUsersGetSingleWithOrganizations({ user_id })
    .then((user) => {
      res.locals.user = user;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const usersGetMultipleWithFields = (req, res, next) => {
  const {
    user_ids,
  } = res.locals;
  const fields = [
    'id',
    'email',
    'profile',
    'settings',
  ];

  return dbUsersGetMultipleWithFields({ user_ids, fields })
    .then((usersWithFields) => {
      res.locals.usersWithFields = usersWithFields;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const usersActivatedNotificationData = (req, res, next) => {
  const {
    user,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { user };

  return next();
};
const usersInvitedNotificationData = (req, res, next) => {
  const {
    organization_id,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { pending_organization_id: organization_id };

  return next();
};
const usersSubscribeToMailChimp = (req, res, next) => {
  const {
    email,
  } = res.locals;
  const promises = [];

  mailChimpListIds.forEach((id) => {
    promises.push(mailchimp.post({
      path: `/lists/${id}`,
      body: {
        members: [{
          email_address: email,
          email_type: 'html',
          status: 'subscribed',
        }],
      },
    }));
  });

  Promise.all(promises)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const organizationDisabledLeftNotificationData = (req, res, next) => {
  const {
    organization_id,
  } = res.locals;

  res.locals.notificationData = null;
  res.locals.eventData = { organization_id };

  return next();
};
const confirmEmailNotificationData = (req, res, next) => {
  res.locals.notificationData = null;
  res.locals.eventData = { confirmed: true };

  return next();
};

export {
  usersGetSingleWithOrganizations,
  usersGetMultipleWithFields,
  usersActivatedNotificationData,
  usersInvitedNotificationData,
  usersSubscribeToMailChimp,
  organizationDisabledLeftNotificationData,
  confirmEmailNotificationData,
};
