import * as a from 'actions';

// ======================================================
// Open find
// ======================================================
export const openFind = (from, targetId) => d => d(a.navigation.openSecondary(from, {
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
export const preview = (from, link, targetId) => (d) => {
  // K_TODO: Backward compatibility remove || link after database query
  const service = link.get('service') || link;
  const meta = link.get('meta') || link;
  const permission = link.get('permission') || link;

  if (service.get('name') === 'swipes' && service.get('type') === 'note') {
    d(a.navigation.openSecondary(from, {
      id: 'SideNote',
      title: 'Note',
      props: {
        id: service.get('id'),
        title: meta.get('title'),
      },
    }));
  } else if (service.get('name') === 'swipes' && service.get('type') === 'url') {
    d(a.main.browser(from, service.get('id')));
  } else {
    d(a.navigation.openSecondary(from, {
      id: 'Preview',
      title: 'Preview',
      props: {
        // K_TODO: Backward compatibility remove || permission.get('shortUrl')
        loadPreview: permission.get('short_url') || permission.get('shortUrl') || service.toJS(),
        targetId,
      },
    }));
  }
};
