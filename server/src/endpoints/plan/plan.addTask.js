import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';

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
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    const planProjectTaskRes = await query(
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
      )
    );

    res.locals.update = update.prepare(plan_id, [
      { type: 'plan_project_task', data: planProjectTaskRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
