import { createSelector } from 'reselect';
import Fuse from 'fuse.js';

const defOptions = {
  shouldSort: true,
  findAllMatches: true,
  includeScore: true,
  includeMatches: true,
  threshold: 0.6,
  location: 0,
  distance: 10,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    'email',
    'profile.first_name',
    'profile.last_name',
  ],
};

const getSearchString = (state, props) => props.searchString;
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

export const getSortedUsers = createSelector(
  [getUsers],
  (users) => users.sort(nameSort),
);

export const getSortedUsersArray = createSelector(
  [getUsers],
  (users) => users.toList().sort(nameSort).toJS(),
);

export const searchUsers = createSelector(
  [getSortedUsersArray, getSearchString],
  (list, searchString) => {
    console.log('recalc', list.map(u => u.profile.last_name), searchString);
    let fuse = new Fuse(list, defOptions); // "list" is the item array
    return fuse.search(searchString);
  },
);
