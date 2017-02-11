import {
  request,
} from './request';

const browse = ({ auth_data, query, page, account_id, user }, callback) => {
  const pathTitle = query ? query.title : '';
  const path = query ? query.path : '';
  const method = page ? 'files.listFolder.continue' : 'files.listFolder';
  const params = page ? {
    cursor: page.cursor,
  } : {
    path,
  };

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const mappedResults = res.entries.filter((entry) => {
      return entry['.tag'] === 'folder' || entry['.tag'] === 'file';
    }).map((entry) => {
      if (entry['.tag'] === 'folder') {
        return {
          title: entry.name,
          left_icon: 'folder',
          on_click: {
            type: 'query',
            query: {
              title: entry.name,
              path: entry.path_lower,
            },
          },
        };
      }

      return {
        title: entry.name,
        left_icon: '',
        on_click: {
          type: 'preview',
          preview: {
            service: {
              name: 'dropbox',
              type: 'file',
              id: `rev:${entry.rev}`,
            },
            permission: {
              account_id,
            },
          },
        },
      };
    });
    return callback(null, {
      title: pathTitle,
      items: mappedResults,
      has_more: res.has_more,
      page: {
        cursor: res.cursor,
      },
    });
  });
};

export {
  browse,
};
