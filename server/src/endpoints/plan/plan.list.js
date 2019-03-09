import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';
import { number } from 'valjs';
import { query } from 'src/utils/db/db';

const expectedInput = {
  skip: number.gte(0),
  limit: number.gte(1).lte(100)
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;

    const skip = input.skip || 0;
    const limit = input.limit || 20;

    const planRes = await query(
      `
        SELECT p.plan_id, p.title, p.start_date, p.end_date, p.owned_by, p.started_at, p.completed_at
        FROM permissions as per
        INNER JOIN plans as p
        ON p.plan_id = per.permission_from
        WHERE ${sqlCheckPermissions('per.granted_to', user_id)}
        AND p.deleted=FALSE
        ORDER BY
          completed_at DESC NULLS FIRST,
          started_at DESC NULLS FIRST,
          created_at DESC
        LIMIT $1
        OFFSET $2
      `,
      [limit + 1, skip]
    );

    const has_more = planRes.rows.length > limit;
    const plans = planRes.rows.slice(0, limit);

    // Create response data.
    res.locals.output = { plans, skip, limit, has_more };
  }
);
