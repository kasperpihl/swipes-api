import {
  version,
} from '../package.json';
import {
  SwipesError,
} from './swipes-error';

const newestElectronVersion = '0.0.3';
const electronUrls = {
  darwin: 'https://www.dropbox.com/s/qbcv6oqeztfq992/Swipes.dmg?dl=1',
  win32: 'https://winurl.com',
};

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
  const webVersion = req.header('sw-web-version');
  const platform = req.header('sw-platform');
  if (webVersion) {
    const latest = parseVersionString(version);
    const running = parseVersionString(webVersion);
    if (latest.major > running.major) {
      return next(new SwipesError('reload_required', {
        reload_required: true,
        reload_available: version,
      }));
    }
    if (latest.minor > running.minor || latest.patch > running.patch) {
      res.locals.reload_available = version;
    }
  }
  if (electronVersion) {
    const latest = parseVersionString(newestElectronVersion);
    const running = parseVersionString(electronVersion);
    if (latest.major > running.major) {
      return next(new SwipesError('update_required', {
        update_required: true,
        update_available: version,
        update_url: electronUrls[platform],
      }));
    }
    if (latest.minor > running.minor || latest.patch > running.patch) {
      res.locals.update_available = version;
      res.locals.update_url = electronUrls[platform];
    }
  }

  return next();
};

export default checkForUpdates;
