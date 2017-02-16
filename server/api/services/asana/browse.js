import {
  request,
} from './request';

const browse = ({ auth_data, query, page, account_id, user }, callback) => {
  const pathTitle = query ? query.title : 'Asana Projects';
  const path = query ? query.path : 'root';
  const method = path === 'root' ? 'workspaces.findAll' : query.nextMethod;
  const pageLimit = 100;
  const params = {};

  if (method === 'projects.findAll') {
    params.workspace = path;
  }

  if (method === 'tasks.findAll') {
    params.project = path;
    params.limit = pageLimit;

    if (page && page.offset) {
      params.offset = page.offset;
    }
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const data = res.data || res;
    let mappedResults = [];

    if (method === 'workspaces.findAll') {
      mappedResults = data.map((item) => {
        return {
          title: item.name,
          left_icon: 'Folder',
          on_click: {
            type: 'query',
            query: {
              title: item.name,
              path: item.id,
              nextMethod: 'projects.findAll',
            },
          },
        };
      });
    }

    if (method === 'projects.findAll') {
      mappedResults = data.map((item) => {
        return {
          title: item.name,
          left_icon: 'Folder',
          on_click: {
            type: 'query',
            query: {
              title: item.name,
              path: item.id,
              nextMethod: 'tasks.findAll',
            },
          },
        };
      });
    }

    if (method === 'tasks.findAll') {
      mappedResults = data.map((item) => {
        return {
          title: item.name,
          on_click: {
            type: 'preview',
            preview: {
              service: {
                name: 'asana',
                type: 'task',
                id: item.id,
              },
              permission: {
                account_id,
              },
            },
          },
        };
      });
    }

    let has_more = false;

    if (res.next_page) {
      has_more = true;
    }

    return callback(null, {
      has_more,
      title: pathTitle,
      items: mappedResults,
      page: res.next_page || {},
    });
  });
};

export {
  browse,
};
