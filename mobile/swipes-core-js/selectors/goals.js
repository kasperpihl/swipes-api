import { createSelector } from 'reselect'
import { searchSelectorFromKeys } from '../classes/utils';

const getGoals = (state) => state.get('goals');

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
