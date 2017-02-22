import config from 'config';
import google from 'googleapis';

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
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.metadata',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/drive.photos.readonly',
  'https://www.googleapis.com/auth/drive.readonly',
];
// these are just the types that we support
// to see the rest - https://developers.google.com/drive/v3/web/mime-types
const googleMimeTypesToExtMap = {
  'application/vnd.google-apps.document': 'gdoc',
  'application/vnd.google-apps.drawing': 'gdrawing',
  'application/vnd.google-apps.presentation': 'gslide',
  'application/vnd.google-apps.spreadsheet': 'gsheet',
};
const appendExtForDriveDocs = (filename, mimeType) => {
  if (googleMimeTypesToExtMap[mimeType]) {
    return `${filename}.${googleMimeTypesToExtMap[mimeType]}`;
  }

  return filename;
};

export {
  createClient,
  scopes,
  googleMimeTypesToExtMap,
  appendExtForDriveDocs,
};
