import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';
import { query } from 'src/utils/db/db';
const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id } = res.locals;

    const planRes = await query(`
      SELECT p.plan_id, p.title, p.start_date, p.end_date, p.owned_by, p.started_at, p.completed_at, task_counter
      FROM permissions as per
      INNER JOIN plans as p
      ON p.plan_id = per.permission_from
      WHERE ${sqlCheckPermissions('per.granted_to', user_id)}
      AND p.deleted=FALSE
    `);
    // Create response data.
    res.locals.output = { plans: planRes.rows };
  }
);
