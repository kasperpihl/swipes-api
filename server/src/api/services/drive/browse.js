import {
  request,
} from './request';
import {
  appendExtForDriveDocs,
} from './utils';

const browse = ({ auth_data, query, page, account_id, user }, callback) => {
  const pathTitle = query ? query.title : 'Google Drive';
  const path = query ? query.path : 'root';
  const sharedWithMeFilter = path === 'root' ? 'or sharedWithMe' : '';
  const method = 'files.list';
  const params = {
    orderBy: 'folder',
    q: `'${path}' in parents ${sharedWithMeFilter} and trashed = false`,
  };

  if (page) {
    params.pageToken = page.pageToken;
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const mappedResults = res.files.filter((file) => {
      return file.kind === 'drive#file';
    }).map((file) => {
      if (file.mimeType === 'application/vnd.google-apps.folder') {
        return {
          title: file.name,
          left_icon: 'Folder',
          on_click: {
            type: 'query',
            query: {
              title: file.name,
              path: file.id,
            },
          },
        };
      }

      return {
        title: appendExtForDriveDocs(file.name, file.mimeType),
        on_click: {
          type: 'preview',
          preview: {
            service: {
              name: 'drive',
              type: 'file',
              id: file.id,
            },
            permission: {
              account_id,
            },
          },
        },
      };
    });

    let has_more = false;

    if (res.nextPageToken) {
      has_more = true;
    }

    return callback(null, {
      has_more,
      title: pathTitle,
      items: mappedResults,
      page: {
        pageToken: res.nextPageToken,
      },
    });
  });
};

export {
  browse,
};
