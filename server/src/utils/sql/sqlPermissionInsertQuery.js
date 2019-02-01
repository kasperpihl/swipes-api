export default (fromId, privacy, ownedBy, userIds) => {
  const permissionQuery = {
    text: `INSERT into permissions (permission_from, owned_by, granted_to) VALUES `,
    values: [fromId, ownedBy]
  };
  if (privacy === 'private') {
    permissionQuery.text += userIds
      .map((uId, i) => `($1, $2, $${i + 1 + permissionQuery.values.length})`)
      .join(', ');
    permissionQuery.values = permissionQuery.values.concat(userIds);
  } else {
    permissionQuery.text += '($1, $2, $3)';
    permissionQuery.values.push(ownedBy);
  }
  return permissionQuery;
};
