import * as mainActions from '../main/mainActions';

export const alert = (options, callback) => (d, getState) => {
  const isBrowserSupported = getState().global.get('isBrowserSupported');
  if (!isBrowserSupported) {
    return window.alert(options.message || options.title);
  }
  d(
    mainActions.contextMenu({
      options,
      component: Confirmation,
      props: {
        title: options.title,
        message: options.message,
        actions: options.actions || [{ text: 'Okay' }],
        onClick: i => {
          d(mainActions.contextMenu(null));
          if (callback) {
            callback(i);
          }
        }
      }
    })
  );
};

export const chooseAttachmentType = options => (d, getState) =>
  new Promise(resolve => {
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
      }
    ];

    const delegate = {
      onItemAction: item => {
        d(mainActions.contextMenu(null));
        resolve(item);
      }
    };
    d(
      mainActions.contextMenu({
        options,
        component: TabMenu,
        props: {
          ...options,
          delegate,
          items
        }
      })
    );
  });
