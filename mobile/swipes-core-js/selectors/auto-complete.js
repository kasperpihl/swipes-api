import { createSelector } from 'reselect';
import * as cs from './';

const getAutoComplete = state => state.get('autoComplete');
const getState = state => state;

export const getResults = createSelector(
  [getAutoComplete, getState],
  (autoComplete, state) => {
    const types = autoComplete.get('types');
    if(types.contains('users')) {
      return cs.users.autoComplete(state);
    }
    return [];
  },
);
