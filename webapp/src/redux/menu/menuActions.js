import * as mainActions from '../main/mainActions';
import * as navigationActions from '../navigation/navigationActions';

export const selectAssignees = (options, assignees, callback) => (
  d,
  getState
) => {};

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

export const chooseDragAndDrop = (files, options) => (dispatch, getState) =>
  new Promise(resolve => {
    const primary = getState().main.getIn(['dragAndDrop', 'primary']);
    const secondary = getState().main.getIn(['dragAndDrop', 'secondary']);
    const secCardActive = getState().navigation.getIn(['secondary', 'stack'])
      .size;

    const items = [
      primary.size
        ? {
            id: 'primary',
            title: `Attach to: ${primary.get(0).title}`,
            subtitle: secCardActive ? 'Left side' : null,
            leftIcon: { icon: secCardActive ? 'CardLeft' : 'CardSingle' }
          }
        : null,
      secondary.size
        ? {
            id: 'secondary',
            title: `Attach to: ${secondary.get(0).title}`,
            subtitle: 'Right side',
            leftIcon: { icon: 'CardRight' }
          }
        : null,
      {
        id: 'discussion',
        title: 'Start a discussion',
        leftIcon: { icon: 'IconDiscuss' }
      }
    ].filter(i => !!i);

    const delegate = {
      onItemAction: item => {
        dispatch(mainActions.contextMenu(null));
        if (item.id === 'primary') {
          primary.last().handler(files);
        }
        if (item.id === 'secondary') {
          secondary.last().handler(files);
        }
        if (item.id === 'discussion') {
          dispatch(
            navigationActions.set('primary', {
              id: 'Discuss',
              title: 'Discuss'
            })
          );
          dispatch(
            mainActions.modal('primary', {
              component: 'DiscussionComposer',
              title: 'Create a discussion',
              position: 'center'
            })
          );
          setTimeout(() => {
            const lastPrimary = getState()
              .main.getIn(['dragAndDrop', 'primary'])
              .last();
            if (lastPrimary) {
              lastPrimary.handler(files);
            }
          }, 1);
        }
        resolve(item);
      }
    };
    dispatch(
      mainActions.contextMenu({
        options,
        showBackground: true,
        component: TabMenu,
        props: {
          ...options,
          delegate,
          items
        }
      })
    );
  });
