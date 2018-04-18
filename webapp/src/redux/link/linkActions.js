import * as navigationActions from '../navigation/navigationActions';
import * as mainActions from '../main/mainActions';

// ======================================================
// Open find
// ======================================================
export const openFind = (from, targetId) => d => d(navigationActions.openSecondary(from, {
  id: 'Find',
  placeholder: 'Search across Dropbox, Asana, Slack...',
  title: 'Find',
  props: {
    targetId,
  },
}));

// ======================================================
// Preview attacment
// ======================================================
export const preview = (from, att, targetId) => (d) => {
  // K_TODO: Backward compatibility remove || link after database query
  const link = att.get('link') || att;
  const service = link.get('service') || link;
  const meta = link.get('meta') || link;
  const title = att.get('title') || meta.get('title');
  const permission = link.get('permission') || link;

  if (service.get('name') === 'swipes' && service.get('type') === 'note') {
    d(navigationActions.openSecondary(from, {
      id: 'SideNote',
      title: 'Note',
      props: {
        id: service.get('id'),
        title,
      },
    }));
  } else if (service.get('name') === 'swipes' && service.get('type') === 'url') {
    d(mainActions.browser(from, service.get('id')));
  } else {
    d(navigationActions.openSecondary(from, {
      id: 'Preview',
      title: 'Preview',
      showTitleInCrumb: true,
      props: {
        // K_TODO: Backward compatibility remove || permission.get('shortUrl')
        loadPreview: permission.get('short_url') || permission.get('shortUrl') || link.toJS(),
        title: title,
        targetId,
      },
    }));
  }
};
