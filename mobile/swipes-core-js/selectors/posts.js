import { createSelector } from 'reselect'

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
