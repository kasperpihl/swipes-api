import {
  version,
} from '../package.json';

import {
  SwipesError,
} from './swipes-error';
import {
  getDownloadLinks,
} from '../api/utils';

const newerVersionExist = (client, server) => {
  server = server || '0';
  client = client || '0';

  let newerVersion = false;
  if(server.indexOf('.') > -1) {

    const serverVals = server.split('.');
    const clientVals = client.split('.');
    let isBigger = false;
    serverVals.forEach((serverVal, i) => {

      const clientVal = parseInt(clientVals[i] || '0', 10);
      serverVal = parseInt(serverVal || '0', 10);
      if(clientVal > serverVal) {
        isBigger = true;
      }
      if(serverVal > clientVal && !isBigger) {
        newerVersion = true;
      }
    })
  } else {
    newerVersion = (parseInt(server, 10) > parseInt(client, 10));
  }

  return newerVersion;
} 

const makeUpdateHandler = (res, next) => {
  let didRun = false;

  const updateHandler = (prefix, isRequired, version,  url) => {
    if(didRun) return;
    didRun = true;

    const _locals = { [`${prefix}_available`]: version }
    if(url) _locals[`${prefix}_url`] = url;
    if(isRequired) {
      _locals[`${prefix}_required`] = true;
      return next(new SwipesError(`${prefix}_required`, _locals));
    }

    Object.entries(_locals).forEach(([key, value]) => {
      res.locals[key] = value;
    });

    return next();
  }
  updateHandler.next = () => !didRun && next();
  return updateHandler;
}


const checkForUpdates = (req, res, next) => {
  const { versions } = res.locals.config;

  const handleUpdate = makeUpdateHandler(res, next);

  const testHeaders = (prefix, url, ...headers) => {
    let required = false;
    let hasNewerVersion = false;
    let version = null;
    headers.forEach((header) => {
      const clientVersion = req.header(`sw-${header}`);
      const newestServerVersion = versions[`newest-${header}`];
      const requiredServerVersion = versions[`required-${header}`];

      if(newerVersionExist(clientVersion, newestServerVersion)) {
        hasNewerVersion = true;
        if(!version) {
          version = newestServerVersion;
        }
      }
      if(newerVersionExist(clientVersion, requiredServerVersion)) {
        required = true;
      }
    });
    if(hasNewerVersion) {
      handleUpdate(prefix, required, version, url);
    };
  };
  const testReload = (...args) => testHeaders('reload', ...args);
  const testUpdate = (...args) => testHeaders('update', ...args);

  
  const platform = req.header('sw-platform');
  switch(platform) {
    case 'ios': {
      testUpdate('itms-beta://beta.itunes.apple.com/v1/app/1250630942', 'ios-build-number');
      testReload(null, 'ios-code-push-version');
      break;
    }
    case 'android': {
      testUpdate('market://details?id=com.swipesapp.release', 'android-build-number');
      testReload(null, 'android-code-push-version');
      break;
    }
    case 'darwin':
    case 'linux':
    case 'win32': {
      testUpdate(getDownloadLinks()[platform], 'electron-version');
      testReload(null, 'web-version');
      break;
    }
    case 'web': {
      testReload(null, 'web-version');
      break;
    }
  }

  return handleUpdate.next();
};

export default checkForUpdates;
