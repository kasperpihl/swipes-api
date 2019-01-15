import { bool, string, object } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { query } from 'src/utils/db/db';
import sofiCreate from 'src/utils/sofiCreate';

const expectedInput = {
  timestamp: string.format('iso8601')
};
const expectedOutput = {
  me: object.require(),
  timestamp: string.format('iso8601').require(),
  full_fetch: bool.require(),
  sofi: object.require()
};

export default endpointCreate(
  {
    expectedInput,
    expectedOutput
  },
  async (req, res) => {
    const { user_id } = res.locals;

    const { timestamp } = res.locals.input;

    const full_fetch = !timestamp;

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
        SELECT organization_id, name, trial_ending, owner_id, pending_users, plan, stripe_subscription_id, stripe_customer_id
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
        SELECT ou.status, ou.organization_id, ou.admin, u.first_name, u.last_name, u.email, u.user_id, u.username, photo
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
    // const discussionTs = user.settings.discussion_counter_ts || defTs;
    // const discussionCounterQ = r
    //   .table('discussions')
    //   .orderBy({ index: r.desc('last_comment_at') })
    //   .filter(disc =>
    //     disc('organization_id')
    //       .eq(organization_id)
    //       .and(
    //         r.table('discussion_followers').get(disc('id').add(`-${user_id}`))
    //       )
    //       .and(disc('archived').eq(false))
    //       .and(disc('last_comment_at').gt(r.ISO8601(discussionTs)))
    //   )
    //   .pluck('id', 'last_comment_at')
    //   .map(obj => ({
    //     id: obj('id'),
    //     ts: obj('last_comment_at')
    //   }))
    //   .limit(10)
    //   .coerceTo('ARRAY');

    const now = new Date().toISOString();

    // const counter = {
    //   discussion: result[4],
    //   discussionTs: user.settings.discussion_counter_ts || null,
    //   myId: user_id
    // };

    // Create response data.
    res.locals.output = {
      me: meRes.rows[0],
      organizations: orgRes.rows,
      users: usersRes.rows,
      sofi: sofiCreate(),
      full_fetch,
      timestamp: now
    };
  }
);
