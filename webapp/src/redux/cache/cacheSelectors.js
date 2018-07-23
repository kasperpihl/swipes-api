import { createSelector } from 'reselect';
import getDeep from 'swipes-core-js/utils/getDeep';

const sorterDesc = key => l => l && l.sort(
  (a, b) => a.get(key).localeCompare(b.get(key))
);
const sorterAsc = key => l => l && l.sort(
  (a, b) => b.get(key).localeCompare(a.get(key))
);

const getDiscussionList = (state, props) => 
  state.getIn([
    'cache',
    'discussion.list',
    getDeep(props, 'options.body.type') || 'following'
  ]);

export const discussionList = createSelector(
  [getDiscussionList],
  sorterDesc('last_comment_at'),
);
