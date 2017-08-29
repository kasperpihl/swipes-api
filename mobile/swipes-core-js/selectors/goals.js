import { createSelector } from 'reselect';
import { List } from 'immutable';
import { searchSelectorFromKeys } from '../classes/utils';
import GoalsUtil from '../classes/goals-util';

const getGoals = (state) => state.get('goals');
const getMilestones = state => state.get('milestones');
const getMyId = state => state.getIn(['me', 'id']);

export const withoutMilestone = createSelector(
  [ getGoals ],
  goals => goals.filter(g => !g.get('milestone_id') && !g.get('completed_at'))
                .sort((g1, g2) => g1.get('created_at').localeCompare(g2.get('created_at'))),
);

export const assignedToMe = createSelector(
  [ getGoals, getMyId ],
  (goals, userId) => goals.filter((g) => {
    const helper = new GoalsUtil(g);
    const currentAssignees = helper.getAssignees();
    return !helper.getIsCompleted() && currentAssignees.find(uId => uId === userId);
  }).sort((g1, g2) => g1.get('created_at').localeCompare(g2.get('created_at'))),
);

export const assignedGroupedByMilestone = createSelector(
  [ assignedToMe, getMilestones ],
  (goals, milestones) => {
    let grouped = goals.groupBy(g => g.get('milestone_id') || 'none');
    grouped = grouped.set('none', grouped.get('none') || List());
    return grouped.sortBy(
      (v, k) => k,
      (m1id, m2id) => {
        // make sure no milestone is last
        if(m1id === 'none' || m2id === 'none') {
          return m1id === 'none' ? 1 : -1;
        }
        const m1 = milestones.get(m1id);
        const m2 = milestones.get(m2id);
        return m1.get('created_at').localeCompare(m2.get('created_at'));
      }
    )
  }
)

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
