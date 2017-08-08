import { createSelector } from 'reselect';
import * as cs from './';

const getSearchString = (state, props) => props.searchString;
const getState = state => state;

export const search = createSelector(
  [getSearchString, getState],
  (searchString, state) => {
    if(!searchString || !searchString.length) {
      return null;
    }
    const foundGoals = cs.goals.search(state, { searchString });
    const foundMilestones = cs.milestones.search(state, { searchString });
    const foundPosts = cs.posts.search(state, { searchString });

    return foundGoals.concat(foundMilestones).concat(foundPosts).sort(
      (a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0)
    );
  },
);
