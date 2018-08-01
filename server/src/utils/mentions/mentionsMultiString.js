export default (userIds, options) => {
    options = options || {};

    const {
      preferId,
      excludeId,
      number = 1,
    } = options;

    const numberOfIds = number;

    if (excludeId && userIds.indexOf(excludeId) > -1) {
      userIds = userIds.filter(uId => uId !== excludeId);
    }

    if (preferId && userIds.indexOf(preferId) > -1) {
      userIds = [preferId].concat(userIds.filter(uId => uId !== preferId));
    }

    userIds = userIds.map(uId => `<!${uId}>`);
    let idString = '';
    let i = 0;

    do {
      const id = userIds[i];
      if (i < numberOfIds && id) {
        let seperator = i > 0 ? ', ' : '';
        if (i === (userIds.length - 1) && i > 0) {
          seperator = ' and ';
        }
        idString += (seperator + id);
      }
      i += 1;
    } while (i < numberOfIds && i < userIds.length);

    if (userIds.length && i < userIds.length) {
      const extra = (userIds.length - i);
      idString += ` and ${extra} other${extra > 1 ? 's' : ''}`;
    }

    return idString;
  }