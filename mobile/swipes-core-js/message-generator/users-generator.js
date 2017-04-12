export default class Users {
  constructor(store) {
    this.store = store;
  }
  getUser(user) {
    if(typeof user === 'string'){
      const state = this.store.getState();
      const users = state.get('users');
      if(user === 'me')
        return state.get('me');
      return users.get(user);
    }
    return user;
  }
  getEmail(userId) {
    const user = this.getUser(userId);
    return user.get('email');
  }
  getProfilePic(userId) {
    const user = this.getUser(userId);
    return user.get('profile_pic');
  }
  getFirstName(userId) {
    const user = this.getUser(userId);
    const firstName = user.get('first_name') || '';
    return firstName.split(' ').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }
  getLastName(userId) {
    const user = this.getUser(userId);
    const lastName = user.get('last_name') || '';
    return lastName.split(' ').map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  }
  getInitials(userId){
    const user = this.getUser(userId);
    let initials = this.getFirstName(user).substring(0, 1);
    const lastName = this.getLastName(user);
    if(lastName.length) {
      initials += lastName.substring(0, 1);
    }
    return initials;
  }
  getFullName(userId) {
    const user = this.getUser(userId);
    const firstName = this.getFirstName(user);
    const lastName = this.getLastName(user);
    let fullName = firstName;
    if(lastName.length){
      fullName += ` ${lastName}`;
    }
    return fullName
  }
  getName(userId, options) {
    options = options || {};
    const state = this.store.getState();
    const users = state.get('users');
    const me = state.get('me');

    if (userId === 'none') {
      return 'no one';
    }
    if (userId === 'me') {
      userId = me.get('id');
    }
    if (users) {
      const user = users.get(userId);
      if (user) {
        if (user.get('id') === me.get('id') && !options.disableYou) {
          return options.yourself ? 'yourself' : 'you';
        }
        const string = user.get('first_name').toLowerCase();
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    }

    return 'anyone';
  }
  getNames(userIds, options) {
    options = options || {};
    const state = this.store.getState();
    if (!userIds || !userIds.size) {
      return 'no one';
    }
    const me = state.get('me');
    const preferId = options.preferId || me.get('id');
    const numberOfNames = options.number || 1;
    if (userIds.includes(preferId)) {
      userIds = userIds.filter(uId => uId !== preferId).insert(0, preferId);
    }
    const names = userIds.map(uId => this.getName(uId, options));
    let nameString = '';
    let i = 0;
    do {
      const name = names.get(i);
      if (i < numberOfNames && name) {
        let seperator = i > 0 ? ', ' : '';
        if (i === (names.size - 1) && i > 0) {
          seperator = ' & ';
        }
        nameString += (seperator + name);
      }
      i += 1;
    } while (i < numberOfNames && i < names.size);
    if (names.size && i < names.size) {
      const extra = (names.size - i);
      nameString += ` & ${extra} other${extra > 1 ? 's' : ''}`;
    }
    return nameString;
  }
}
