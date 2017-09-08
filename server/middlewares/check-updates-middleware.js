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
  server = server || '';
  client = client || '';

  let newerVersion = false;
  if(server.indexOf('.') > -1) {

    const serverVals = server.split('.');
    const clientVals = client.split('.');
    serverVals.forEach((serverVal, i) => {
      const clientVal = clientVals[i];
      if(serverVals > clientVals) {
        newerVersion = true;
      }
    })
  } else {
    newerVersion = (server > client);
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
      const serverVersion = versions[header];
      const requiredServerVersion = versions[`min-${header}`];
      if(newerVersionExist(clientVersion, serverVersion)) {
        hasNewerVersion = true;
        if(!version) {
          version = serverVersion;
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
      testUpdate(null, 'ios-build-number');
      testReload(null, 'ios-code-push-version');
      break;
    }
    case 'android': {
      testUpdate(null, 'android-build-number');
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
