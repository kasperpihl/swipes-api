import * as types from 'constants';
import * as a from 'actions';
import InputMenu from 'src/react/context-menus/input-menu/InputMenu';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';

export const save = (options, goal, callback) => (d, getState) => {
  console.log('saving');
  const organizationId = getState().getIn(['me', 'organizations', 0, 'id']);
  d(a.main.contextMenu({
    options,
    component: InputMenu,
    props: {
      placeholder: 'Name your Way: Like Development, Design etc.',
      buttonLabel: 'Save',
      onClick: (title) => {
        if (title && title.length) {
          d(a.api.request('ways.create', {
            title,
            goal,
            organization_id: organizationId,
          })).then((res) => {
            console.log('ressy', res);
          });
        }
      },
    },
  }));
};

export const load = (options, callback) => (d, getState) => {
  const sortedWays = getState().getIn([
    'main',
    'ways',
  ]).sort((b, c) => b.get('title').localeCompare(c.get('title'))).toArray();
  const resultForWay = (way) => {
    const obj = {
      id: way.get('id'),
      title: way.get('title'),
      subtitle: way.get('description'),
    };
    return obj;
  };
  const searchForWay = q => sortedWays.map((w) => {
    if (w.get('title').toLowerCase().startsWith(q.toLowerCase())) {
      return resultForWay(w);
    }
    return null;
  }).filter(v => !!v);

  let tabMenu;
  const delegate = {
    onTabMenuLoad: (tMenu) => {
      tabMenu = tMenu;
    },
    resultsForSearch: query => searchForWay(query),
    resultsForAll: () => sortedWays.map(w => resultForWay(w)),
    onItemAction: (obj, side, e) => {
      const way = getState().getIn(['main', 'ways', obj.id]);
      callback(way);
      d(a.main.contextMenu(null));
      console.log('action!', obj, side, e);
    },
  };

  d(a.main.contextMenu({
    options,
    component: TabMenu,
    props: {
      search: 'Search for company ways',
      delegate,
    },
  }));
};
