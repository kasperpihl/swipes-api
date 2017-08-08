import { createSelector } from 'reselect'
import { searchSelectorFromKeys } from '../classes/utils';

const getFilterId = (state, props) => props.filterId;
const getPosts = (state) => state.get('posts');

export const getSortedIds = createSelector(
  [ getPosts, getFilterId ],
  (posts, filterId) => {
    if(filterId) {
      posts = posts.filter(p => p.getIn(['context', 'id']) === filterId);
    }
    return posts.toList().sort((a, b) => {
      return b.get('created_at').localeCompare(a.get('created_at'));
    }).map(p => p.get('id'));
  }
)

export const searchablePosts = createSelector(
  [ getPosts ],
  posts => posts.map(p => p.set('comments', p.get('comments').toList())).toList()
)

export const search = searchSelectorFromKeys([
  'message',
  'comments.message',
  'attachments.title',
  'comments.attachments.title',
], searchablePosts);
