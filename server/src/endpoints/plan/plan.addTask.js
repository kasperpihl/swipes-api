import { string } from 'valjs';
import { query, transaction } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

const expectedInput = {
  plan_id: string.require(),
  project_id: string.require(),
  task_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'plan_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { plan_id, project_id, task_id } = res.locals.input;

    // permissionKey validated that I have access to plan and it exists,
    // Now ensure project is owned by the same and that the task/project exist!
    const foundProjectRes = await query(
      `
        SELECT pt.task_id
        FROM projects pr
        INNER JOIN plans pl
        ON pl.plan_id = $1
        INNER JOIN project_tasks pt
        ON pt.project_id = $2 AND pt.task_id = $3
        WHERE pr.project_id = $2
        AND pl.owned_by = pr.owned_by
      `,
      [plan_id, project_id, task_id]
    );

    if (!foundProjectRes.rows.length) {
      throw Error('Not found').code(404);
    }
    console.log(foundProjectRes.rows);

    await transaction([
      sqlInsertQuery(
        'plan_project_tasks',
        {
          plan_id,
          project_id,
          task_id
        },
        {
          upsert: 'plan_project_tasks_pkey'
        }
      ),
      {
        text: `
          UPDATE plans
          SET tasks_count = tasks_count + 1
          WHERE plan_id = $1
        `,
        values: [plan_id]
      }
    ]);
  }
);
