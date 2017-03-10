import * as a from 'actions';
import AddAttachment from 'context-menus/add-attachment/AddAttachment';

// ======================================================
// Call links.create and pass back obj in form of attachment
// ======================================================
export const addLinkAndCallback = (ty, lO, cb) => d => d(a.api.request('links.create', lO)).then((res) => {
  if (res && res.ok && cb) {
    cb('ready', ty, {
      shortUrl: res.short_url,
      title: lO.meta.title,
      ...lO.service,
    });
  } else if (cb) {
    cb('error', ty, res);
  }
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
export const addNote = (options, cb) => (d, getState) => {
  d(a.menus.input({
    ...options,
    placeholder: 'Enter note title',
    buttonLabel: 'Add',
  }, (title) => {
    cb('start', 'note');
    const state = getState();
    const orgId = state.getIn(['me', 'organizations', 0, 'id']);
    d(a.notes.create(orgId)).then((res) => {
      if (res && res.ok) {
        const linkObj = d(getSwipesLinkObj(title));
        linkObj.service.type = 'note';
        linkObj.service.id = res.note.id;
        d(addLinkAndCallback('note', linkObj, cb));
      } else if (cb) {
        cb('error', 'note', res);
      }
    });
  }));
};

// ======================================================
// Adding a url (open context menu and then add)
// ======================================================
export const addURL = (options, callback) => (d) => {
  d(a.menus.input({
    ...options,
    placeholder: 'Enter a URL',
    buttonLabel: 'Add',
  }, (url) => {
    callback('start', 'url');
    const linkObj = d(getSwipesLinkObj(url));
    linkObj.service.type = 'url';
    linkObj.service.id = url;
    d(addLinkAndCallback('url', linkObj, callback));
  }));
};

// ======================================================
// Open find (and then add)
// ======================================================
export const openFind = (from, callback) => d => d(a.navigation.openSecondary(from, {
  id: 'Find',
  placeholder: 'Search across Dropbox, Asana, Slack...',
  title: 'Find',
  props: {
    onAttach: (linkObj) => {
      callback('start', 'find');
      d(addLinkAndCallback('find', linkObj, callback));
    },
  },
}));

export const openPreview = (from, props) => (d) => {
  d(a.navigation.openSecondary(from, {
    id: 'Preview',
    title: 'Preview',
    props,
  }));
};

// ======================================================
// Preview attacment
// ======================================================
export const preview = (from, data) => (d) => {
  if (data.get('name') === 'swipes' && data.get('type') === 'note') {
    d(a.navigation.openSecondary(from, {
      id: 'SideNote',
      title: 'Note',
      props: {
        id: data.get('id'),
      },
    }));
  } else if (data.get('name') === 'swipes' && data.get('type') === 'url') {
    d(a.main.browser(from, data.get('id')));
  } else {
    d(openPreview(from, {
      loadPreview: data.get('shortUrl') || data.toJS(),
    }));
  }
};
