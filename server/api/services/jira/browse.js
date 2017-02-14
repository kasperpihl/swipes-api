import {
  request,
} from './request';

const browse = ({ auth_data, query, page, account_id, user }, callback) => {
  const pathTitle = query ? query.title : 'Jira Projects';
  const path = query ? query.path : 'root';
  const method = path === 'root' ? 'project.getAllProjects' : 'search.search';
  const pageLimit = 100;
  const min = page ? parseInt(page.min, 10) : 0;
  const max = page ? parseInt(page.max, 10) : pageLimit;
  let params = {};

  if (method === 'search.search') {
    params = {
      jql: `project=${path}`,
      startAt: min,
      maxResults: max,
      // comment `fields` if you want to see the full results
      fields: [
        'summary',
      ],
    };
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    let mappedResults = [];

    if (path === 'root') {
      mappedResults = res.map((item) => {
        return {
          title: item.name,
          left_icon: 'Folder',
          on_click: {
            type: 'query',
            query: {
              title: item.name,
              path: item.id,
            },
          },
        };
      });
    } else {
      mappedResults = res.issues.map((item) => {
        return {
          title: `${item.key} - ${item.fields.summary}`,
          on_click: {
            type: 'preview',
            preview: {
              service: {
                name: 'jira',
                type: 'issue',
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

    const total = res.total;
    const nextPage = {
      total,
      min: max,
      max: max + pageLimit,
    };
    let has_more = false;

    if (total >= nextPage.max) {
      has_more = true;
    }

    return callback(null, {
      has_more,
      title: pathTitle,
      items: mappedResults,
      page: nextPage,
    });
  });
};

export {
  browse,
};
