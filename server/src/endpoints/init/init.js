import r from 'rethinkdb';
import { bool, string, object } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import db from 'src/utils/db/db';
import sofiCreate from 'src/utils/sofiCreate';

const defTs = new Date(1970, 1, 1).toISOString();

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
    endpoint: '/init',
    expectedInput,
    expectedOutput
  },
  async (req, res) => {
    const { user_id } = res.locals;

    const { timestamp = defTs } = res.locals.input;

    const full_fetch = timestamp.startsWith('1970');

    const meRes = await db(`
      SELECT created_at, updated_at, id, email, profile, activated, settings from users WHERE id = '${user_id}'
    `);

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
      sofi: sofiCreate(),
      full_fetch,
      timestamp: now
    };
  }
);
