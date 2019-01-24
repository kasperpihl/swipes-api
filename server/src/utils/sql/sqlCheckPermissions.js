export default function sqlCheckPermissions(attribute, userId) {
  return `
    ${attribute}
    IN (
      SELECT '${userId}' as organization_id /* Personal Support */
      UNION ALL
      SELECT organization_id 
      FROM organization_users 
      WHERE user_id = '${userId}'
      AND status = 'active'
    )
  `;
}
