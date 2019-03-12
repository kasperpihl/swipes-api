import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';

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
        completed_at = null,
        started_at = null,
        updated_at = now()
      WHERE plan_id = $1
      RETURNING plan_id, updated_at, completed_at, started_at
    `,
      [plan_id]
    );
    if (!planRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    // Create response data.
    res.locals.update = update.prepare(plan_id, [
      { type: 'plan', data: planRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
