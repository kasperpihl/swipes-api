import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import Confirmation from 'src/react/context-menus/confirmation/Confirmation';
import InputMenu from 'src/react/context-menus/input-menu/InputMenu';
import * as cs from 'swipes-core-js/selectors';
import * as mainActions from '../main/mainActions';

export const confirm = (options, callback) => (d, getState) => {
  const isBrowserSupported = getState().getIn(['globals', 'isBrowserSupported']);
  if(!isBrowserSupported) {
    const res = window.confirm(options.message || options.title);
    return callback(res ? 1 : 0);
  }
  d(mainActions.contextMenu({
    options,
    component: Confirmation,
    props: {
      title: options.title,
      message: options.message,
      actions: options.actions,
      onClick: (i) => {
        d(mainActions.contextMenu(null));
        if (callback) {
          callback(i);
        }
      },
    },
  }));
};

export const alert = (options, callback) => (d, getState) => {
  const isBrowserSupported = getState().getIn(['globals', 'isBrowserSupported']);
  if(!isBrowserSupported) {
    return window.alert(options.message || options.title);
  }
  d(mainActions.contextMenu({
    options,
    component: Confirmation,
    props: {
      title: options.title,
      message: options.message,
      actions: options.actions || [{ text: 'Okay' }],
      onClick: (i) => {
        d(mainActions.contextMenu(null));
        if (callback) {
          callback(i);
        }
      },
    },
  }));
}

export const input = (options, callback) => (d, getState) => {
  const isBrowserSupported = getState().getIn(['globals', 'isBrowserSupported']);
  if(!isBrowserSupported) {
    const res = window.prompt(options.placeholder, options.text);
    return callback(res);
  }
  d(mainActions.contextMenu({
    options,
    component: InputMenu,
    props: {
      ...options,
      onResult: (title) => {
        d(mainActions.contextMenu(null));
        if (callback) {
          callback(title);
        }
      },
    },
  }));
};


export const selectMilestone = (options, callback) => (d, getState) => {

  const resultForMilestone = (milestoneId) => {
    const obj = {
      id: milestoneId,
      title: msgGen.milestones.getName(milestoneId),
      selected: options.selectedId === milestoneId,
    };
    return obj;
  };

  const defItems = [];
  defItems.push({ id: 'none', title: 'No plan' });
  
  const allMilestones = () => defItems.concat(
    cs.milestones.getCurrent(getState()).map(m => resultForMilestone(m.get('id'))).toArray()
  );

  const searchForMilestone = q => cs.milestones.searchCurrent(getState(), { 
    searchString: q 
  }).map(res => resultForMilestone(res.item.id));

  const delegate = {
    onItemAction: (item) => {
      callback(item);
      d(mainActions.contextMenu(null));
    },
    resultsForAll: () => allMilestones(),
    resultsForSearch: query => searchForMilestone(query),
  };
  d(mainActions.contextMenu({
    options,
    component: TabMenu,
    props: {
      search: 'Search for plan',
      delegate,
    },
  }));
};

export const chooseAttachmentType = (options) => (d, getState) => new Promise((resolve) => {
  const items = [
    {
      id: 'note',
      title: 'New note',
      leftIcon: { icon: 'Note' },
      subtitle: 'Create a note to share more details'
    },
    {
      id: 'url',
      title: 'Add URL',
      leftIcon: { icon: 'Hyperlink' },
      subtitle: 'Share links to useful information from the web'
    },
    {
      id: 'upload',
      title: 'Upload a file',
      leftIcon: { icon: 'File' },
      subtitle: 'Add documents, presentations or photos.'
    },
  ];

  const delegate = {
    onItemAction: (item) => {
      d(mainActions.contextMenu(null));
      resolve(item);
    },
  };
  d(mainActions.contextMenu({
    options,
    component: TabMenu,
    props: {
      ...options,
      delegate,
      items,
    },
  }));
})
