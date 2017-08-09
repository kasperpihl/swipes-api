import { createSelector } from 'reselect'
import { searchSelectorFromKeys } from '../classes/utils';
import GoalsUtil from '../classes/goals-util';

const getGoals = (state) => state.get('goals');
const getMyId = state => state.getIn(['me', 'id']);

export const assignedToMe = createSelector(
  [ getGoals, getMyId ],
  (goals, userId) => goals.filter((g) => {
    const helper = new GoalsUtil(g);
    const currentAssignees = helper.getCurrentAssignees();
    return !helper.getIsCompleted() && currentAssignees.find(uId => uId === userId);
  }).sort((g1, g2) => g2.get('created_at').localeCompare(g1.get('created_at'))),
);

export const searchAbleGoals = createSelector(
  [ getGoals ],
  goals => goals.map((g) => {
    return g.set('steps', g.get('steps').toList()).set('attachments', g.get('attachments').toList())
  })
)

export const search = searchSelectorFromKeys([
  'title',
  'steps.title',
  'attachments.title',
], searchAbleGoals);
