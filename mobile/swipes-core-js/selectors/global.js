import { createSelector } from 'reselect';
import * as cs from './';

const getSearchString = (state, props) => props.searchString;
const getState = state => state;

export const search = createSelector(
  [getSearchString, getState],
  (searchString, state) => {
    const foundGoals = cs.goals.search(state, { searchString });
    const foundMilestones = cs.milestones.search(state, { searchString });
    const foundPosts = cs.posts.search(state, { searchString });


    console.log(foundGoals.concat(foundMilestones).concat(foundPosts).sort(
      (a,b) => (a.score > b.score) ? 1 : ((b.score > a.score) ? -1 : 0)
    ).map(i => i.item));
    return [];
  },
);
