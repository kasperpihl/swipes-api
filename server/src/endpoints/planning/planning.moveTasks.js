import { string } from 'valjs';
import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';

const expectedInput = {
  owned_by: string.require(),
  from_year_week: string.require(),
  to_year_week: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res, next) => {
    // Get inputs
    const { owned_by, from_year_week, to_year_week } = res.locals.input;

    const [insertToRes, deleteFromRes] = await transaction([
      {
        text: `
          INSERT INTO planning_tasks(owned_by, year_week, project_id, task_id)
            SELECT pt.owned_by, $1, pt.project_id, pt.task_id
            FROM planning_tasks pt
            INNER JOIN projects p
            ON pt.project_id = p.project_id
            WHERE pt.owned_by = $2
            AND pt.year_week = $3
            AND (
              p."completion"->>pt.task_id = 'false'
                OR 
              p."completion"->>pt.task_id IS null
            )
          ON CONFLICT ON CONSTRAINT planning_tasks_pkey
          DO NOTHING
          RETURNING *
        `,
        values: [to_year_week, owned_by, from_year_week]
      },
      {
        text: `
          DELETE FROM planning_tasks pt
          USING projects p
          WHERE pt.owned_by = $1
          AND pt.project_id = p.project_id
          AND pt.year_week = $2
          AND (
            p."completion"->>pt.task_id = 'false'
              OR 
            p."completion"->>pt.task_id IS null
          )
          RETURNING pt.owned_by, pt.year_week, pt.project_id, pt.task_id
        `,
        values: [owned_by, from_year_week]
      }
    ]);

    // Prepare updates with both deleted and added planning.
    res.locals.update = update.prepare(
      owned_by,
      deleteFromRes.rows
        .map(row => ({
          type: 'planning_task',
          data: {
            ...row,
            deleted: true
          }
        }))
        .concat(
          insertToRes.rows.map(row => ({
            type: 'planning_task',
            data: row
          }))
        )
    );
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
