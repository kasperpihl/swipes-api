import { object, array } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';
import { query } from 'src/utils/db/db';
import sofiCreate from 'src/utils/sofiCreate';

const expectedInput = {};
const expectedOutput = {
  me: object.require(),
  users: array.require(),
  organizations: array.require(),
  unread: object.require(),
  sofi: object.require()
};

export default endpointCreate(
  {
    expectedInput,
    expectedOutput
  },
  async (req, res) => {
    const { user_id } = res.locals;
    const now = new Date().toISOString();

    const meRes = await query(
      `
        SELECT user_id, email, first_name, last_name, photo, activated, settings
        FROM users
        WHERE user_id = $1
      `,
      [user_id]
    );

    const orgRes = await query(
      `
        SELECT organization_id, name, trial_ending, owner_id, pending_users, stripe_subscription_id, plan
        FROM organizations
        WHERE organization_id
        IN (
          SELECT organization_id
          FROM organization_users
          WHERE user_id = $1
          AND status = 'active'
        )
      `,
      [user_id]
    );

    const usersRes = await query(
      `
        SELECT ou.status, ou.organization_id, ou.admin, u.first_name, u.last_name, u.email, u.user_id, u.username, u.photo
        FROM organization_users ou
        LEFT JOIN users u
        ON u.user_id = ou.user_id
        WHERE ou.organization_id
        IN (
          SELECT organization_id
          FROM organization_users
          WHERE user_id = $1
          AND status = 'active'
        )
      `,
      [user_id]
    );

    const unreadRes = await query(
      `
        SELECT d.discussion_id, d.last_comment_at
        FROM permissions as per
        INNER JOIN discussions as d
        ON d.discussion_id = per.permission_from
        WHERE ${sqlCheckPermissions('per.granted_to', user_id)}
        AND d.followers->>$1 IS NOT NULL
        AND d.deleted=FALSE
        AND d.followers->>$1 = 'n'
        OR d.followers->>$1 < to_char(d.last_comment_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
      `,
      [user_id]
    );
    const unread = {};
    unreadRes.rows.forEach(r => (unread[r.discussion_id] = r.last_comment_at));

    // Create response data.
    res.locals.output = {
      me: meRes.rows[0],
      organizations: orgRes.rows,
      unread,
      timestamp: now,
      users: usersRes.rows,
      sofi: sofiCreate()
    };
  }
);
