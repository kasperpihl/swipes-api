import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

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

    await query(
      `
      UPDATE plans
      SET
        completed_at = now(),
        updated_at = now()
      WHERE plan_id = $1
    `,
      [plan_id]
    );
  }
);
