import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import { transaction, query } from 'src/utils/db/db';
import redisPublish from 'src/utils/redis/redisPublish';
import update from 'src/utils/update';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import tokenParse from 'src/utils/token/tokenParse';
import stripeUpdateQuantity from 'src/utils/stripe/stripeUpdateQuantity';

const expectedInput = {
  invitation_token: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { invitation_token } = input;
    const parsedToken = tokenParse('sw-i', invitation_token);

    if (!parsedToken || !parsedToken.tokenContent) {
      throw Error('invalid_token');
    }

    const { sub: organization_id, aud: email, exp } = parsedToken.tokenContent;

    const orgRes = await query(
      `
        SELECT o.organization_id, o.pending_users, ou.status
        FROM organizations o
        LEFT JOIN organization_users ou
        ON ou.user_id = $2
        AND ou.organization_id = o.organization_id
        WHERE o.organization_id = $1
      `,
      [organization_id, user_id]
    );
    const org = orgRes.rows[0];

    const now = Math.floor(Date.now() / 1000);
    if (!org.pending_users[email] || exp < now || org.status === 'active') {
      throw Error('invalid_token').info(org);
    }

    const [orgUserRes, orgInsertRes] = await transaction([
      sqlInsertQuery(
        'organization_users',
        {
          user_id,
          organization_id,
          status: 'active'
        },
        {
          upsert: 'organization_users_pkey'
        }
      ),
      {
        text: `
          UPDATE organizations
          SET 
            pending_users = jsonb_strip_nulls(
              pending_users || jsonb_build_object('${email}', null)
            )
          WHERE organization_id = $1
          RETURNING organization_id, pending_users
        `,
        values: [organization_id]
      }
    ]);

    await redisPublish(user_id, { type: 'forceDisconnect' });

    res.locals.backgroundInput = {
      organization_id
    };

    res.locals.update = update.prepare(organization_id, [
      { type: 'organization', data: orgInsertRes.rows[0] },
      { type: 'organization_user', data: orgUserRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  update.send(res.locals.update);
  const { organization_id } = res.locals.input;
  await stripeUpdateQuantity(organization_id);
});
