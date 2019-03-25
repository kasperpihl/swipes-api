import { string } from 'valjs';
import { query } from 'src/utils/db/db';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
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

    // permissionKey validated that I have access to plan and it exists,
    // Now ensure project is owned by the same and that the project exist!
    const foundProjectRes = await query(
      `
        SELECT owned_by
        FROM projects
        WHERE project_id = $1
        AND owned_by = $2
      `,
      [project_id, owned_by]
    );

    if (!foundProjectRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    const planProjectTaskRes = await query(
      sqlInsertQuery(
        'planning_tasks',
        {
          owned_by,
          year_week,
          project_id,
          task_id
        },
        {
          upsert: 'planning_tasks_pkey'
        }
      )
    );

    res.locals.update = update.prepare(owned_by, [
      { type: 'planning_task', data: planProjectTaskRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
