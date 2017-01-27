import * as a from 'actions';
import AddAttachment from 'context-menus/add-attachment/AddAttachment';
import InputMenu from 'context-menus/input-menu/InputMenu';

// ======================================================
// Call links.create and pass back obj in form of attachment
// ======================================================
const addLinkAndCallback = (linkObj, callback) => (d) => {
  d(a.api.request('links.create', linkObj)).then((res) => {
    if (res && res.ok && callback) {
      callback({
        shortUrl: res.short_url,
        title: linkObj.meta.title,
        ...linkObj.service,
      });
    }
  });
};

// ======================================================
// Open up input menu for writing a title
// ======================================================
const inputMenu = (options, props) => a.main.contextMenu({
  options,
  component: InputMenu,
  props,
});

// ======================================================
// Default link obj with swipes as service
// ======================================================
const getSwipesLinkObj = title => (d, getState) => {
  const state = getState();
  const myId = state.getIn(['me', 'id']);
  return {
    service: {
      name: 'swipes',
    },
    permission: {
      account_id: myId,
    },
    meta: {
      title,
    },
  };
};

// ======================================================
// Adding a note (open context menu and then add)
// ======================================================
export const addNote = (options, callback) => (d, getState) => {
  d(inputMenu(options, {
    placeholder: 'Enter note title',
    buttonLabel: 'Add',
    onResult: (title) => {
      const state = getState();
      const orgId = state.getIn(['me', 'organizations', 0, 'id']);
      d(a.main.note.create(orgId, title)).then((res) => {
        if (res && res.ok) {
          const linkObj = d(getSwipesLinkObj(title));
          linkObj.service.type = 'note';
          linkObj.service.id = res.id;
          d(a.main.note.show(res.id));
          d(addLinkAndCallback(linkObj, callback));
        }
      });
    },
  }));
};

// ======================================================
// Adding a url (open context menu and then add)
// ======================================================
export const addURL = (options, callback) => (d) => {
  d(inputMenu(options, {
    placeholder: 'Enter a URL',
    buttonLabel: 'Add',
    onResult: (url) => {
      const linkObj = d(getSwipesLinkObj(url));
      linkObj.service.type = 'url';
      linkObj.service.id = url;
      d(addLinkAndCallback(linkObj, callback));
    },
  }));
};

// ======================================================
// Open find (and then add)
// ======================================================
export const openFind = callback => d => d(a.navigation.push({
  component: 'Find',
  placeholder: 'Search across Dropbox, Asana, Slack...',
  title: 'Find',
  props: {
    actionLabel: 'Attach to Goal',
    actionCallback: (service, permission, meta) => {
      if (typeof callback === 'string') {
        const goalId = callback;

        callback = (link) => {
          console.log(goalId, link);
          d(a.goals.addToCollection(goalId, link));
        };
      }
      d(addLinkAndCallback({ service, permission, meta }, callback));
    },
  },
}));

// ======================================================
// Open add (and then add)
// ======================================================
export const addMenu = (options, callback) => (d) => {
  d(a.main.contextMenu({
    options,
    component: AddAttachment,
    props: {
      callback: (type) => {
        if (type === 'note') {
          d(addNote(options, callback));
        } else if (type === 'url') {
          d(addURL(options, callback));
        } else if (type === 'find') {
          d(openFind(options.goalId || callback));
        }
      },
    },
  }));
};

// ======================================================
// Preview attacment
// ======================================================
export const preview = data => (d) => {
  const att = data;
  if (att.get('name') === 'swipes' && att.get('type') === 'note') {
    d(a.main.note.show(att.get('id')));
  } else if (att.get('name') === 'swipes' && att.get('type') === 'url') {
    d(a.main.browser(att.get('id')));
    // window.open(att.get('id'));
  } else if (att.get('shortUrl')) {
    d(a.main.preview(att.get('shortUrl')));
  }
};
