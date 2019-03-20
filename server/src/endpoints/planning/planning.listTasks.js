import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  owned_by: string.require(),
  year_week: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res, next) => {
    // Get inputs
    const { owned_by, year_week } = res.locals.input;

    const taskRes = await query(
      `
        SELECT *
        FROM planning_tasks
        WHERE owned_by = $1
        AND year_week = $2
      `,
      [owned_by, year_week]
    );
    // Create response data.
    res.locals.output = {
      tasks: taskRes.rows
    };
  }
);
