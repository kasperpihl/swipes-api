import { createSelector } from 'reselect';
import Fuse from 'fuse.js';

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
    'email',
    'profile.first_name',
    'profile.last_name',
  ],
};

const getAutoCompleteString = state => state.getIn(['autoComplete', 'string']);
const getUsers = state => state.get('users');
const getString = (state, string) => string;

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

export const getActive = createSelector(
  [getSorted],
  (users) => users.filter(u => !u.get('disabled')),
);
export const getActiveArray = createSelector(
  [getActive],
  (users) => users.toList().toJS(),
);

export const getDisabled = createSelector(
  [getSorted],
  (users) => users.filter(u => !!u.get('disabled')),
);

export const search = createSelector(
  [getActiveArray, getString],
  (list, string) => {
    let fuse = new Fuse(list, defOptions); // "list" is the item array
    return fuse.search(string || '');
  }
)

export const autoComplete = createSelector(
  [getActiveArray, getAutoCompleteString],
  (list, autoCompleteString) => {
    let fuse = new Fuse(list, defOptions); // "list" is the item array
    return fuse.search(autoCompleteString || '').map((res) => {
      const { item } = res;
      const user = msgGen.users.getUser(item);
      const profilePic = msgGen.users.getPhoto(user);
      res.resultItem = {
        title: msgGen.users.getFullName(user),
      }
      if (profilePic) {
        res.resultItem.leftIcon = {
          src: profilePic,
        };
      } else {
        res.resultItem.leftIcon = {
          initials: {
            color: 'white',
            backgroundColor: '#000C2F',
            letters: msgGen.users.getInitials(user),
          },
        };
      }
      return res;
    });
  },
);
