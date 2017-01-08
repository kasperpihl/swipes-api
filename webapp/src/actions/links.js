import * as c from 'constants';
import * as a from 'actions';
import AttachmentMenu from 'components/attachment-menu/AttachmentMenu';

export const add = (link, permission, meta) => a.api.request('link.create', {
  link,
  permission,
  meta,
});

export const get = ids => (d) => {
  d(a.api.request('link.get', { ids })).then((res) => {
    if (res.ok) {
      d({ type: c.LOAD_LINKS, payload: res.links });
    }
  });
};

export const addMenu = (options, callback) => (d, getState) => {
  const state = getState();
  const myId = state.getIn(['me', 'id']);
  const navId = state.getIn(['navigation', 'id']);
  d(a.main.contextMenu({
    options,
    component: AttachmentMenu,
    props: {
      callback: (type, data) => {
        const addLinkAndCallback = (link, permission, meta) => {
          d(add(link, permission, meta)).then((res) => {
            if (res && res.ok && callback) {
              callback({
                shortUrl: res.short_url,
                title: meta.title,
                ...link,
              });
            }
          });
        };
        if (type === 'note' && data && data.length) {
          d(a.main.note.create(navId, data)).then((res) => {
            if (res && res.ok) {
              addLinkAndCallback({
                type: 'note',
                service: 'swipes',
                id: res.id,
              }, {
                account_id: myId,
              }, {
                title: data,
              });
            }
          });
        } else if (type === 'link' && data && data.length) {
          addLinkAndCallback({
            type: 'url',
            service: 'swipes',
            id: data,
          }, {
            account_id: myId,
          }, {
            title: data,
          });
        } else if (type === 'find') {
          d(a.main.overlay({
            component: 'Find',
            props: {
              actionLabel: 'Attach to Goal',
              actionCallback: (link, permission, meta) => {
                addLinkAndCallback(link, permission, meta);
              },
            },
          }));
        }
        d(a.main.contextMenu(null));
      },
    },
  }));
};

export const click = data => (dispatch, getState) => {
  let att = data;
  const state = getState();
  if (data.get('short_url')) {
    att = state.getIn(['main', 'links', data.get('short_url')]);
  }
  if (att.get('service') === 'swipes' && att.get('type') === 'note') {
    dispatch(a.main.note.show(att.get('id')));
  }
  if (att.get('service') === 'swipes' && att.get('type') === 'url') {
    dispatch(a.main.overlay({
      component: 'Browser',
      props: {
        url: att.get('id'),
      },
    }));
    // window.open(att.get('id'));
  }
};
