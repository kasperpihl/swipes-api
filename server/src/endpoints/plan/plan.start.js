import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import redisSendUpdates from 'src/utils/redis/redisSendUpdates';
import dbReceiversForPermissionId from 'src/utils/db/dbReceiversForPermissionId';

const expectedInput = {
  plan_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'plan_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { plan_id } = res.locals.input;

    const planRes = await query(
      `
        UPDATE plans
        SET
          started_at = now(),
          updated_at = now()
        WHERE plan_id = $1
        RETURNING plan_id, updated_at, started_at
      `,
      [plan_id]
    );
    if (!planRes.rows.length) {
      throw Error('Not found').code(404);
    }
    // Create response data.
    res.locals.output = {
      updates: [{ type: 'plan', data: planRes.rows[0] }]
    };
  }
).background(async (req, res) => {
  const { updates } = res.locals.output;
  const plan = updates[0].data;

  const recs = await dbReceiversForPermissionId(plan.plan_id);
  await redisSendUpdates(recs, updates);
});
