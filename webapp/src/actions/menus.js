import TabMenu from 'src/react/context-menus/tab-menu/TabMenu';
import Confirmation from 'src/react/context-menus/confirmation/Confirmation';
import InputMenu from 'src/react/context-menus/input-menu/InputMenu';
import * as cs from 'swipes-core-js/selectors';
import * as a from './';

export const confirm = (options, callback) => (d) => {
  d(a.main.contextMenu({
    options,
    component: Confirmation,
    props: {
      title: options.title,
      message: options.message,
      actions: options.actions,
      onClick: (i) => {
        d(a.main.contextMenu(null));
        if (callback) {
          callback(i);
        }
      },
    },
  }));
};

export const input = (options, callback) => (d) => {
  d(a.main.contextMenu({
    options,
    component: InputMenu,
    props: {
      ...options,
      onResult: (title) => {
        d(a.main.contextMenu(null));
        if (callback) {
          callback(title);
        }
      },
    },
  }));
};


export const selectMilestone = (options, callback) => (d, getState) => {

  const state = getState();
  const milestones = state.get('milestones');

  const resultForMilestone = (milestone) => {
    const obj = {
      id: milestone.get('id'),
      title: msgGen.milestones.getName(milestone),
      selected: options.selectedId === milestone.get('id'),
    };
    return obj;
  };

  const sortedMilestones = () => milestones.sort((m1, m2) => {
    return msgGen.users.getFirstName(m1).localeCompare(msgGen.users.getFirstName(m2));
  }).toArray();

  const defItems = [];
  if(!options.disableAny){
    defItems.push({ id: null, title: 'Any milestone' });
  }
  defItems.push({ id: 'none', title: 'No milestone' });
  const allMilestones = () => defItems.concat(sortedMilestones().map(m => resultForMilestone(m)));

  const searchForMilestone = q => sortedMilestones().filter((m) => {
    return (msgGen.milestones.getName(m).toLowerCase().startsWith(q.toLowerCase()))
  }).map(m => resultForMilestone(m));

  const delegate = {
    onItemAction: (item) => {
      callback(item);
      d(a.main.contextMenu(null));
    },
    resultsForAll: () => allMilestones(),
    resultsForSearch: query => searchForMilestone(query),
  };
  d(a.main.contextMenu({
    options,
    component: TabMenu,
    props: {
      search: 'Search for milestone',
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
      d(a.main.contextMenu(null));
      resolve(item);
    },
  };
  d(a.main.contextMenu({
    options,
    component: TabMenu,
    props: {
      ...options,
      delegate,
      items,
    },
  }));
})
