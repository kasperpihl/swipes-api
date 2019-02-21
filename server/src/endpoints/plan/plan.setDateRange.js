import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import update from 'src/utils/update';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  plan_id: string.require(),
  start_date: string
    .max(10)
    .format(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
    .require(),
  end_date: string
    .max(10)
    .format(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/)
    .require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'plan_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { start_date, end_date, plan_id } = res.locals.input;

    if (start_date > end_date) {
      throw Error('Start date is before end date');
    }

    const planRes = await query(
      `
        UPDATE plans
        SET
          updated_at = now(),
          start_date = $1,
          end_date = $2
        WHERE plan_id = $3
        RETURNING plan_id, updated_at, start_date, end_date
      `,
      [start_date, end_date, plan_id]
    );
    res.locals.update = update.prepare(plan_id, [
      {
        type: 'plan',
        data: planRes.rows[0]
      }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
