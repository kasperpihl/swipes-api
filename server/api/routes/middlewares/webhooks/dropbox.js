import config from 'config';
import crypto from 'crypto';
import {
  dropboxGetAuthDataByAccounts,
} from '../db_utils/webhooks';
import {
  dropbox,
} from '../../../services';

const dropboxConfig = config.get('dropbox');
const validate = (req, res, next) => {
  const signature = req.headers['x-dropbox-signature'];
  const message = req.body.toString();
  const hash =
    crypto.createHmac('sha256', dropboxConfig.appSecret)
      .update(message)
      .digest('hex');

  if (signature !== hash) {
    return res.status(403).send();
  }

  res.locals.message = JSON.parse(message);

  return next();
};
const process = (req, res, next) => {
  const message = res.locals.message;
  const accounts = message.list_folder.accounts;

  dropboxGetAuthDataByAccounts({ accounts })
    .then((accountsAuthData) => {
      accountsAuthData.forEach((accountAuthData) => {
        dropbox.webhooks(accountAuthData, (err) => {
          if (err) {
            console.log('ERROR Processing drobox webhook', err);
          }
        });
      });
    })
    .catch((error) => {
      console.log(error);
    });

  return next();
};

export {
  validate,
  process,
};
