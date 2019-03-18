import { string } from 'valjs';
import { query } from 'src/utils/db/db';
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

    const planProjectTaskRes = await query(
      `
        DELETE FROM plan_project_tasks
        WHERE plan_id = $1
        AND project_id = $2
        AND task_id = $3
        RETURNING task_id, project_id, plan_id
      `,
      [plan_id, project_id, task_id]
    );

    res.locals.update = update.prepare(plan_id, [
      {
        type: 'plan_project_task',
        data: {
          ...planProjectTaskRes.rows[0],
          deleted: true
        }
      }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
