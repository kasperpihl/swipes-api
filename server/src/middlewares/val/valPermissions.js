import { query } from 'src/utils/db/db';

export default function valPermissions({ permissionKey, permissionCreateKey }) {
  return async (req, res, next) => {
    if (!permissionKey && !permissionCreateKey) {
      return next();
    }

    const { user_id } = res.locals;

    if (permissionCreateKey) {
      const permissionRes = await query(
        `
            SELECT permission_to
            FROM user_permissions
            WHERE user_id = $1
            AND permission_to = $2
        `,
        [user_id, res.locals.input[permissionCreateKey]]
      );
      if (!permissionRes || !permissionRes.rows.length) {
        throw Error('forbidden').code(403);
      }
    } else {
      const permissionRes = await query(
        `
          SELECT permission_id
          FROM permissions
          WHERE permission_id = $1
          AND granted_to
          IN (
            SELECT permission_to
            FROM user_permissions
            WHERE user_id = $2
          )
        `,
        [res.locals.input[permissionKey], user_id]
      );

      if (!permissionRes || !permissionRes.rows.length) {
        throw Error('not_found').code(404);
      }
    }

    return next();
  };
}
