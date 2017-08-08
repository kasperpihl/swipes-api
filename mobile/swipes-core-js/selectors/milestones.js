import { createSelector } from 'reselect';
import Fuse from 'fuse.js';
import { List } from 'immutable';
import GoalsUtil from '../classes/goals-util';

const defOptions = {
  shouldSort: true,
  includeScore: true,
  includeMatches: true,
  tokenize: true,
  id: 'id',
  threshold: 0.5,
  matchAllTokens: true,
  maxPatternLength: 32,
  minMatchCharLength: 2,
  keys: [
    'title',
  ],
};

const getMilestone = (state, props) => state.getIn(['milestones', props.milestoneId]);
const getAllGoals = (state) => state.get('goals');

export const getGoals = createSelector(
  [ getMilestone, getAllGoals ],
  (milestone, goals) => milestone.get('goal_order')
    .reverse()
    .map(gId => goals.get(gId)),
)

export const getGroupedGoals = createSelector(
  [ getGoals, ],
  goals => {
    let gg = goals.groupBy(g => {
      const helper = new GoalsUtil(g);
      return helper.getIsCompleted() ? 'Completed' : 'Current';
    });
    gg = gg.set('Current', gg.get('Current') || List());
    gg = gg.set('Completed', gg.get('Completed') || List());
    gg = gg.set('Later', gg.get('Later') || List());
    return gg;
  }
)
