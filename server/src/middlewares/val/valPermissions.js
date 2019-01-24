import { query } from 'src/utils/db/db';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';

export default function valPermissions({ permissionKey, permissionCreateKey }) {
  return async (req, res, next) => {
    if (!permissionKey && !permissionCreateKey) {
      return next();
    }

    const { user_id } = res.locals;

    if (permissionCreateKey) {
      // Don't check Personal creations.
      if (res.locals.input[permissionCreateKey] !== user_id) {
        const permissionRes = await query(
          `
            SELECT organization_id
            FROM organization_users 
            WHERE user_id = $1
            AND organization_id = $1
            AND status = 'active'
          `,
          [user_id, res.locals.input[permissionCreateKey]]
        );
        if (!permissionRes || !permissionRes.rows.length) {
          throw Error('forbidden').code(403);
        }
      }
    } else {
      const permissionRes = await query(
        `
          SELECT permission_from
          FROM permissions
          WHERE permission_from = $1
          AND ${sqlCheckPermissions('granted_to', user_id)}
        `,
        [res.locals.input[permissionKey]]
      );

      if (!permissionRes || !permissionRes.rows.length) {
        throw Error('not_found').code(404);
      }
    }

    return next();
  };
}
