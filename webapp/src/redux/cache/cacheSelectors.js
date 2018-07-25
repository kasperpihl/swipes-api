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

const getDiscussion = (state, props) => 
  state.getIn([
    'cache',
    'discussion.get',
    props.discussionId,
  ]);

const getCommentList = (state, props) =>
  state.getIn([
    'cache',
    'comment.list',
    getDeep(props, 'options.body.discussion_id'),
  ]);

export const discussionList = createSelector(
  [getDiscussionList],
  sorterDesc('last_comment_at'),
);

export const discussionGet = createSelector(
  [getDiscussion],
  (discussion) => discussion,
)

export const commentList = createSelector(
  [getCommentList],
  sorterDesc('sent_at'),
);