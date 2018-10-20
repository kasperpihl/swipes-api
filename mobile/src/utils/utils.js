export function mobileNavForContext(id) {
  let obj;
  if (typeof id === 'object') {
    obj = id;
    id = id.get('id');
  }
  if (id.startsWith('G')) {
    return {
      id: 'GoalOverview',
      title: 'Goal overview',
      props: {
        goalId: id,
      },
    };
  } else if (id.startsWith('M')) {
    return {
      id: 'MilestoneOverview',
      title: 'Milestone overview',
      props: {
        milestoneId: id,
      },
    };
  } else if (id.startsWith('P')) {
    return {
      id: 'PostView',
      title: 'Post',
      props: {
        postId: id,
      },
    };
  } else if (id.startsWith('N')) {
    if (obj) {
      return {
        id: 'PreviewNote',
        title: 'Note',
        props: {
          noteId: id,
          noteTitle: obj.get('title'),
        },
      };
    }
  } else if (id.startsWith('F')) {
    return 'MiniFile';
  }
}
