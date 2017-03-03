import * as a from 'actions';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';

export const save = (options, title, goal) => (d, getState) => {
  const organizationId = getState().getIn(['me', 'organizations', 0, 'id']);
  return d(a.api.request('ways.create', {
    title,
    goal,
    organization_id: organizationId,
  }));
};

export const load = (options, callback) => (d, getState) => {
  const loadWays = () => getState().getIn([
    'main',
    'ways',
  ]).sort((b, c) => b.get('title').localeCompare(c.get('title'))).toArray();
  const deletingIds = {};
  const resultForWay = (way) => {
    const obj = {
      id: way.get('id'),
      title: way.get('title'),
      subtitle: way.get('description'),
      rightIcon: {
        button: {
          icon: 'Trash',
        },
      },
    };
    if (deletingIds[way.get('id')]) {
      obj.rightIcon.button.loading = true;
    }
    return obj;
  };
  const searchForWay = q => loadWays().map((w) => {
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
    resultsForAll: () => loadWays().map(w => resultForWay(w)),
    onItemAction: (obj, side) => {
      if (side === 'right') {
        deletingIds[obj.id] = true;
        d(a.api.request('ways.archive', { id: obj.id })).then(() => {
          delete deletingIds[obj.id];
          setTimeout(() => tabMenu.reload(), 1);
        });
        tabMenu.reload();
      } else {
        const way = getState().getIn(['main', 'ways', obj.id]);
        callback(way);
        d(a.main.contextMenu(null));
      }
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
