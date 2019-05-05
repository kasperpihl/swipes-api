import newerVersionExist from 'src/utils/newerVersionExist';

const downloadLinks = {
  darwin: 'https://swipesapp.com/download-mac',
  win32: 'https://swipesapp.com/download-win',
  linux: 'https://swipesapp.com/download-linux'
};

export default async (req, res, next) => {
  const platform = req.header('sw-platform');
  const { requiredVersions, newestVersions } = res.locals.config;

  const headers = {
    'sw-ios': 'itms-apps://itunes.apple.com/app/apple-store/id1250630942?mt=8',
    'sw-android': 'market://details?id=com.swipesapp.release',
    'sw-electron': downloadLinks[platform],
    'sw-web': false // reload only
  };

  let clientUpdate;
  Object.entries(headers).forEach(([header, url]) => {
    const clientVersion = req.header(header);
    if (
      (clientUpdate && clientUpdate.required) ||
      typeof clientVersion === 'undefined'
    )
      return;

    if (newerVersionExist(clientVersion, newestVersions[header])) {
      clientUpdate = {
        type: header,
        required: newerVersionExist(clientVersion, requiredVersions[header])
      };
      if (url) {
        clientUpdate.url = url;
      }
    }
  });

  res.locals.__clientUpdate = clientUpdate;
  if (clientUpdate && clientUpdate.required) {
    throw Error('update_required');
  }
};
