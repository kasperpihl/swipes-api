import { object, array, string } from 'valjs';
import { query, transaction } from 'src/utils/db/db';
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

    await query(
      `
        UPDATE plans
        SET
          updated_at = now(),
          start_date = $1,
          end_date = $2
        WHERE plan_id = $3
      `,
      [start_date, end_date, plan_id]
    );
  }
);
