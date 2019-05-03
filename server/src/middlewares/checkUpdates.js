import newerVersionExist from 'src/utils/newerVersionExist';

const downloadLinks = {
  darwin: 'https://swipesapp.com/download-mac',
  win32: 'https://swipesapp.com/download-win',
  linux: 'https://swipesapp.com/download-linux'
};

const makeUpdateHandler = (res, next) => {
  let didRun = false;

  const updateHandler = (prefix, isRequired, version, url) => {
    if (didRun) return;

    didRun = true;

    const _locals = { [`${prefix}_available`]: version };
    if (url) _locals[`${prefix}_url`] = url;

    if (isRequired) {
      _locals[`${prefix}_required`] = true;

      throw Error(`${prefix}_required`).toClient();
      // return next(Error(`${prefix}_required`, _locals));
    }

    res.locals.__updatesAvailable = _locals;
    Object.entries(_locals).forEach(([key, value]) => {
      res.locals[key] = value;
    });

    return next();
  };
  updateHandler.next = () => !didRun && next();
  return updateHandler;
};

export default (req, res, next) => {
  const platform = req.header('sw-platform');
  const { requiredVersions, newestVersions } = res.locals.config;
  const handleUpdate = makeUpdateHandler(res, next);

  const testHeaders = (prefix, url, ...headers) => {
    let required = false;
    let hasNewerVersion = false;
    let version = null;
    headers.forEach(header => {
      const clientVersion = req.header(`sw-${header}`);
      const newestServerVersion = newestVersions[platform];
      const requiredServerVersion = requiredVersions[platform];

      if (newerVersionExist(clientVersion, newestServerVersion)) {
        hasNewerVersion = true;
        if (!version) {
          version = newestServerVersion;
        }
      }

      if (newerVersionExist(clientVersion, requiredServerVersion)) {
        required = true;
      }
    });
    if (hasNewerVersion) {
      handleUpdate(prefix, required, version, url);
    }
  };
  const testReload = (...args) => testHeaders('reload', ...args);
  const testUpdate = (...args) => testHeaders('update', ...args);

  switch (platform) {
    case 'ios': {
      testUpdate(
        'itms-apps://itunes.apple.com/app/apple-store/id1250630942?mt=8',
        'ios-build-number'
      );
      // testReload(null, 'ios-code-push-version');
      break;
    }
    case 'android': {
      testUpdate(
        'market://details?id=com.swipesapp.release',
        'android-build-number'
      );
      // testReload(null, 'android-code-push-version');
      break;
    }
    case 'darwin':
    case 'linux':
    case 'win32': {
      testUpdate(downloadLinks[platform], 'electron-version');
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
