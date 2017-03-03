import {
  version,
} from '../package.json';
import {
  SwipesError,
} from './swipes-error';

const newestElectronVersion = '0.0.4';
const electronUrls = {
  darwin: {
    x64: 'https://www.dropbox.com/s/qbcv6oqeztfq992/Swipes.dmg?dl=1',
  },
  win32: {
    ia32: 'https://www.dropbox.com/s/cxo9ifcvm2hhgbq/Swipes-win32-ia32.zip?dl=1',
    x64: 'https://www.dropbox.com/s/mveq4y2lcvinu37/Swipes-win32-x64.zip?dl=1',
  },
  linux: {
    ia32: 'https://www.dropbox.com/s/wbbpqrml7m7ln7s/Swipes-linux-ia32.zip?dl=1',
    x64: 'https://www.dropbox.com/s/qy3i8y4dxpxbosh/Swipes-linux-x64.zip?dl=1',
  },
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
    const latest = parseVersionString(newestElectronVersion);
    const running = parseVersionString(electronVersion);
    if (latest.major > running.major) {
      return next(new SwipesError('update_required', {
        update_required: true,
        update_available: version,
        update_url: electronUrls[platform][arch],
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
