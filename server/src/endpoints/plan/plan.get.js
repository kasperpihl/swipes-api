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
    const { plan_id } = res.locals.input;
    const planRes = await query(
      `
        SELECT plan_id, title, start_date, end_date, owned_by, task_counter, started_at, completed_at
        FROM plans
        WHERE plan_id = $1
        AND deleted = FALSE
      `,
      [plan_id]
    );

    if (!planRes || !planRes.rows.length) {
      throw Error('project_not_found').code(404);
    }
    res.locals.output = {
      plan: planRes.rows[0]
    };
  }
);
