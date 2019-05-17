import { object, array } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';
import { query } from 'src/utils/db/db';

const expectedInput = {};
const expectedOutput = {
  me: object.require(),
  users: array.require(),
  teams: array.require(),
  unread: object.require()
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

    const teamRes = await query(
      `
        SELECT team_id, name, trial_ending, owner_id, pending_users, stripe_subscription_id, plan
        FROM teams
        WHERE team_id
        IN (
          SELECT team_id
          FROM team_users
          WHERE user_id = $1
          AND status = 'active'
        )
      `,
      [user_id]
    );

    const usersRes = await query(
      `
        SELECT ou.status, ou.team_id, ou.admin, u.first_name, u.last_name, u.email, u.user_id, u.username, u.photo
        FROM team_users ou
        LEFT JOIN users u
        ON u.user_id = ou.user_id
        WHERE ou.team_id
        IN (
          SELECT team_id
          FROM team_users
          WHERE user_id = $1
          AND status = 'active'
        )
      `,
      [user_id]
    );

    const unreadRes = await query(
      `
        SELECT d.discussion_id, d.last_comment_at, d.owned_by
        FROM permissions as per
        INNER JOIN discussions as d
        ON d.discussion_id = per.permission_from
        WHERE ${sqlCheckPermissions('per.granted_to', user_id)}
        AND d.members->>$1 IS NOT NULL
        AND d.deleted=FALSE
        AND d.members->>$1 = 'n'
        OR d.members->>$1 < to_char(d.last_comment_at::timestamp at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')
      `,
      [user_id]
    );
    const unread = {};
    const unreadByTeam = {};
    unreadRes.rows.forEach(r => {
      if (!unreadByTeam[r.owned_by]) {
        unreadByTeam[r.owned_by] = {};
      }
      unreadByTeam[r.owned_by][r.discussion_id] = r.last_comment_at;
      unread[r.discussion_id] = r.last_comment_at;
    });

    // Create response data.
    res.locals.output = {
      me: meRes.rows[0],
      teams: teamRes.rows,
      unread,
      unread_by_team: unreadByTeam,
      timestamp: now,
      users: usersRes.rows
    };
  }
);
