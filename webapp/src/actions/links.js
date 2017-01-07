import * as types from 'constants';
import * as a from 'actions';
import AttachmentMenu from 'components/attachment-menu/AttachmentMenu';

export const add = (link, permission, meta) => d => d(a.api.request('link.create', {
  link,
  permission,
  meta,
}));

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
              callback(res.short_url, meta);
            }
          });
        };
        if (type === 'note' && data && data.length) {
          d(a.main.note.create(navId, data)).then((res) => {
            if (res && res.ok) {
              addLinkAndCallback({
                type: 'note',
                service_name: 'swipes',
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
            service_name: 'swipes',
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
