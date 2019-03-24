export default function sqlCheckPermissions(attribute, userId) {
  return `
    ${attribute}
    IN (
      SELECT '${userId}' as team_id /* Personal Support */
      UNION ALL
      SELECT team_id 
      FROM team_users 
      WHERE user_id = '${userId}'
      AND status = 'active'
    )
  `;
}
