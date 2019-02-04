import { query } from './db';
export default async function dbReceiversForPermissionId(permissionId) {
  const receiverRes = await query(
    `
      SELECT granted_to
      FROM permissions
      WHERE permission_from = $1
    `,
    [permissionId]
  );
  if (!receiverRes.rows.length) {
    throw Error('Not found').code(404);
  }
  return receiverRes.rows.map(row => row.granted_to);
}
