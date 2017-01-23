import * as c from 'constants';
import * as a from 'actions';
import AddAttachment from 'components/attachments/AddAttachment';

export const add = (service, permission, meta) => a.api.request('links.create', {
  service,
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
  const orgId = state.getIn(['me', 'organizations', 0, 'id']);
  d(a.main.contextMenu({
    options,
    component: AddAttachment,
    props: {
      callback: (type, data) => {
        const addLinkAndCallback = (service, permission, meta) => {
          d(add(service, permission, meta)).then((res) => {
            if (res && res.ok && callback) {
              callback({
                shortUrl: res.short_url,
                title: meta.title,
                ...service,
              });
            }
          });
        };
        if (type === 'note' && data && data.length) {
          d(a.main.note.create(orgId, data)).then((res) => {
            if (res && res.ok) {
              addLinkAndCallback({
                type: 'note',
                name: 'swipes',
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
            name: 'swipes',
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
              actionCallback: (service, permission, meta) => {
                addLinkAndCallback(service, permission, meta);
              },
            },
          }));
        }
        d(a.main.contextMenu(null));
      },
    },
  }));
};

export const preview = data => (dispatch) => {
  const att = data;
  if (att.get('name') === 'swipes' && att.get('type') === 'note') {
    dispatch(a.main.note.show(att.get('id')));
  } else if (att.get('name') === 'swipes' && att.get('type') === 'url') {
    dispatch(a.main.browser(att.get('id')));
    // window.open(att.get('id'));
  } else if (att.get('shortUrl')) {
    dispatch(a.main.preview(att.get('shortUrl')));
  }
};
