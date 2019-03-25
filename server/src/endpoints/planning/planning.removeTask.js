import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';

const expectedInput = {
  owned_by: string.require(),
  year_week: string.require(),
  project_id: string.require(),
  task_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'project_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { owned_by, year_week, project_id, task_id } = res.locals.input;

    const planProjectTaskRes = await query(
      `
        DELETE FROM planning_tasks
        WHERE owned_by = $1
        AND year_week = $2
        AND project_id = $3
        AND task_id = $4
        RETURNING *
      `,
      [owned_by, year_week, project_id, task_id]
    );

    res.locals.update = update.prepare(owned_by, [
      {
        type: 'planning_task',
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
