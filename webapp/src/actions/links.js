import * as c from 'constants';
import * as a from 'actions';
import AddAttachment from 'components/attachments/AddAttachment';

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
  const orgId = state.getIn(['me', 'organizations', 0, 'id']);
  d(a.main.contextMenu({
    options,
    component: AddAttachment,
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
          d(a.main.note.create(orgId, data)).then((res) => {
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
  const att = data;
  if (att.get('service') === 'swipes' && att.get('type') === 'note') {
    dispatch(a.main.note.show(att.get('id')));
  }
  if (att.get('service') === 'swipes' && att.get('type') === 'url') {
    dispatch(a.main.browser(att.get('id')));
    // window.open(att.get('id'));
  }
  if (att.get('service') === 'dropbox') {
    const id = att.get('id');

    dispatch(a.modal.load('preview', {
      loading: true,
    }));
    const state = getState();
    const accountId = state.getIn(['me', 'services']).find(s => s.get('service_name') === 'dropbox').get('id');
    dispatch(a.api.request('services.request', {
      service_name: 'dropbox',
      account_id: accountId,
      data: {
        method: 'files.getTemporaryLink',
        parameters: {
          path: id,
        },
      },
    })).then((res) => {
      console.log(res);
      if (res && res.data && res.data.link) {
        const dropboxFolder = localStorage.getItem('dropbox-folder');
        const fullFilePath = dropboxFolder + res.data.metadata.path_display;
        const name = res.data.metadata.name;
        const endArr = name.split('.');
        const fileExt = endArr[endArr.length - 1];

        const link = res.data.link;
        const buttons = [];
        const newData = {
          type: null,
          title: name,
        };

        if (dropboxFolder) {
          buttons.push({
            icon: 'Desktop',
            title: 'Open on Desktop',
            onClick: () => {
              window.ipcListener.sendEvent('showItemInFolder', fullFilePath);
            },
          });
        }

        buttons.push({
          icon: 'Earth',
          title: 'Open in Dropbox.com',
          onClick: () => {
            const url = `https://www.dropbox.com/home${res.data.metadata.path_lower}`;
            window.ipcListener.sendEvent('openExternal', url);
          },
        }, {
          icon: 'Download',
          title: 'Download',
          onClick: () => {
            window.location.replace(link);
          },
        });

        newData.actions = buttons;

        // const path = res.data.metadata.path_display;
        if (['png', 'gif', 'jpeg', 'jpg'].indexOf(fileExt) > -1) {
          newData.img = res.data.link;
          newData.type = 'image';
        }
        if (fileExt === 'pdf') {
          newData.pdf = res.data.link;
          newData.type = 'pdf';
        }
        dispatch(a.modal.load('preview', newData, () => {
        }));
      }
    });
  }
};
