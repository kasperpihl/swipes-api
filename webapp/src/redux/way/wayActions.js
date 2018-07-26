import * as ca from 'swipes-core-js/actions';
import * as cs from 'swipes-core-js/selectors';
import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import * as mainActions from '../main/mainActions';

export const load = (options, callback) => (d, getState) => {
  const deletingIds = {};
  const resultForWay = (way) => {
    if(typeof way === 'string') {
      way = getState().ways.get(way);
    }
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

  const allWays = () => cs.ways.getSorted(getState()).map(w => resultForWay(w)).toArray();
  
  const searchForWay = q => cs.ways.search(getState(), {
    searchString: q,
  }).map(res => resultForWay(res.item.id))
  let tabMenu;

  const delegate = {
    onTabMenuLoad: (tMenu) => {
      tabMenu = tMenu;
    },
    resultsForSearch: query => searchForWay(query),
    resultsForAll: () => allWays(),
    onItemAction: (obj, side) => {
      if (side === 'right') {
        deletingIds[obj.id] = true;
        d(ca.ways.archive(obj.id)).then(() => {
          delete deletingIds[obj.id];
          setTimeout(() => tabMenu.reload(), 1);
        });
        tabMenu.reload();
      } else {
        const way = getState().ways.get(obj.id);
        callback(way);
        d(mainActions.contextMenu(null));
      }
    },
  };

  d(mainActions.contextMenu({
    options,
    component: TabMenu,
    props: {
      search: 'Search for company ways',
      delegate,
    },
  }));
};
