import {
  request,
} from './request';

const rootObj = (id, name) => {
  return {
    title: name,
    left_icon: 'Folder',
    on_click: {
      type: 'query',
      query: {
        title: name,
        path: id,
      },
    },
  };
};
const mapRootResults = (res) => {
  const mappedResults = [];

  res.channels.forEach((item) => {
    if (!item.is_archived) {
      mappedResults.push(rootObj(item.id, item.name));
    }
  });

  res.groups.forEach((item) => {
    if (!item.is_archived) {
      mappedResults.push(rootObj(item.id, item.name));
    }
  });

  res.mpims.forEach((item) => {
    if (!item.is_archived) {
      // https://regex101.com/r/HDgDaE/2
      // Extracts the names from a group chat's name
      // which format is mpdm-name1--name2--nameN-1
      const re = /^(.+?-)(.*)(-.+?)/gi;
      const matches = re.exec(item.name);
      const name = matches[2].split('--').join(', ');

      mappedResults.push(rootObj(item.id, name));
    }
  });

  res.ims.forEach((item) => {
    if (!item.is_archived) {
      const user = res.users.find((user) => {
        return user.id === item.user;
      });

      mappedResults.push(rootObj(item.id, user.name));
    }
  });

  return mappedResults;
};
const mapFileResults = (res, account_id) => {
  const mappedResults = res.files.map((file) => {
    return {
      title: file.name,
      on_click: {
        type: 'preview',
        preview: {
          service: {
            name: 'slack',
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

  return mappedResults;
};
const browse = ({ auth_data, query, page, account_id, user }, callback) => {
  const pathTitle = query ? query.title : 'Slack channels';
  const path = query ? query.path : 'root';
  const method = path === 'root' ? 'rtm.start' : 'files.list';
  const count = 100;
  const pageNumber = page && page.page ? page.page + 1 : '1';
  let params = {};

  if (method === 'rtm.start') {
    params = {
      simple_latest: true,
      no_unreads: true,
      mpim_aware: true,
    };
  }

  if (method === 'files.list') {
    params = {
      count,
      channel: path,
      page: pageNumber,
    };
  }

  return request({ auth_data, method, params, user }, (err, res) => {
    if (err) {
      return callback(err);
    }

    const mapper = path === 'root' ? mapRootResults : mapFileResults;
    const mappedResults = mapper(res, account_id);
    const nextPage = res.paging;
    let has_more = false;

    if (path !== 'root' && nextPage.page < nextPage.pages) {
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
