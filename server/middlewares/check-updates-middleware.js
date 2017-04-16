import {
  version,
} from '../package.json';

import {
  SwipesError,
} from './swipes-error';
import {
  getNewestElectronVersion,
  getDownloadLinks,
} from '../utils';

const parseVersionString = (version) => {
  const x = version.split('.');
  const major = parseInt(x[0], 10) || 0;
  const minor = parseInt(x[1], 10) || 0;
  const patch = parseInt(x[2], 10) || 0;

  return {
    major,
    minor,
    patch,
  };
};
const checkForUpdates = (req, res, next) => {
  const electronVersion = req.header('sw-electron-version');
  const arch = req.header('sw-electron-arch');
  const webVersion = req.header('sw-web-version');

  const platform = req.header('sw-platform');
  if (webVersion) {
    const latest = parseVersionString(version);
    const running = parseVersionString(webVersion);
    if (latest.major > running.major || latest.minor > running.minor) {
      return next(new SwipesError('reload_required', {
        reload_required: true,
        reload_available: version,
      }));
    }
    if (latest.patch > running.patch) {
      res.locals.reload_available = version;
    }
  }
  if (electronVersion) {
    const latest = parseVersionString(getNewestElectronVersion());
    const running = parseVersionString(electronVersion);
    if (latest.major > running.major) {
      return next(new SwipesError('update_required', {
        update_required: true,
        update_available: version,
        update_url: getDownloadLinks()[platform], // electronUrls[platform][arch]
      }));
    }
    if (latest.minor > running.minor || latest.patch > running.patch) {
      res.locals.update_available = version;
      res.locals.update_url = getDownloadLinks()[platform];
    }
  }

  return next();
};

export default checkForUpdates;
