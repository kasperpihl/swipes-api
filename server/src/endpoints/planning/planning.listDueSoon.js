import { number, string } from 'valjs';
import { query, transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  owned_by: string.require(),
  skip: number,
  limit: number
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res, next) => {
    // Get inputs
    const { owned_by, skip = 0, limit = 100 } = res.locals.input;

    const taskRes = await query(
      `
        SELECT p.title as project_title, p.owned_by, pt.title as task_title, pt.project_id, pt.task_id, pt.due_date, pt.assignees
        FROM project_tasks pt
        LEFT JOIN projects p
        ON p.project_id = pt.project_id
        WHERE p.owned_by = $1
        AND pt.due_date IS NOT NULL
        ORDER BY pt.due_date
        LIMIT $2
        OFFSET $3
      `,
      [owned_by, limit, skip]
    );

    // Create response data.
    res.locals.output = {
      tasks: taskRes.rows
    };
  }
);
