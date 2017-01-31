import config from 'config';
import google from 'googleapis';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const googleConfig = config.get('google');
const createClient = () => {
  const OAuth2 = google.auth.OAuth2;
  const oauth2Client = new OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirectUri,
  );

  return oauth2Client;
};
const scopes = [
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
];
const buildEmailBody = (resource) => {
  if (!resource.to) {
    return new SwipesError('resource.to is required!');
  }

  if (!resource.from) {
    return new SwipesError('resource.from is required!');
  }

  if (!resource.bcc) {
    resource.bcc = '';
  }

  if (!resource.subject) {
    resource.subject = 'No Subject';
  }

  const str =
  ['Content-Type: text/plain; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: ', resource.to, '\n',
    'from: ', resource.from, '\n',
    'bcc: ', resource.bcc, '\n',
    'subject: ', resource.subject, '\n\n',
    resource.message,
  ].join('');

  const encodedMail = new Buffer(str).toString('base64');

  return encodedMail;
};

export {
  createClient,
  scopes,
  buildEmailBody,
};
