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
            SELECT team_id
            FROM team_users 
            WHERE user_id = $1
            AND team_id = $2
            AND status = 'active'
          `,
          [user_id, res.locals.input[permissionCreateKey]]
        );
        if (!permissionRes || !permissionRes.rows.length) {
          throw Error('Forbidden')
            .code(403)
            .toClient();
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
        throw Error('Not found')
          .code(404)
          .toClient();
      }
    }

    return next();
  };
}
