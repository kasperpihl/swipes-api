import { createSelector } from 'reselect';
import Fuse from 'fuse.js';

const defOptions = {
  shouldSort: true,
  findAllMatches: true,
  id: 'id',
  includeScore: true,
  includeMatches: true,
  tokenize: true,
  threshold: 0.4,
  matchAllTokens: true,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    'email',
    'profile.first_name',
    'profile.last_name',
  ],
};

const getAutoComplete = state => state.get('autoComplete');
const getUsers = state => state.get('users');

const nameSort = (a, b) => {
  const f1 = msgGen.users.getFirstName(a);
  const f2 = msgGen.users.getFirstName(b);
  if (f1 !== f2) {
    return f1.localeCompare(f2);
  }
  const l1 = msgGen.users.getLastName(a);
  const l2 = msgGen.users.getLastName(b);
  return l1.localeCompare(l2);
};

export const getSorted = createSelector(
  [getUsers],
  (users) => users.sort(nameSort),
);

export const getSortedArray = createSelector(
  [getUsers],
  (users) => users.toList().sort(nameSort).toJS(),
);

export const autoComplete = createSelector(
  [getSortedArray, getAutoComplete],
  (list, autoComplete) => {
    let fuse = new Fuse(list, defOptions); // "list" is the item array
    return fuse.search(autoComplete.get('string') || '');
  },
);
