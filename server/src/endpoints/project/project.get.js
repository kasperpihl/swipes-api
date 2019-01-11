import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpointCreate';
import { string } from 'valjs';

const expectedInput = {
  project_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'project_id'
  },
  async (req, res) => {
    const { project_id } = res.locals.input;
    const projectRes = await query(
      `
        SELECT project_id, name, discussion_id, due_date, ordering, indention, completion, rev, owned_by, completion_percentage
        FROM projects
        WHERE project_id = $1
        AND deleted = FALSE
      `,
      [project_id]
    );

    if (!projectRes || !projectRes.rows.length) {
      throw Error('project_not_found').code(404);
    }

    const tasksRes = await query(
      `
        SELECT "task_id", "title", "due_date"
        FROM project_tasks
        WHERE "project_id" = $1 
        AND deleted = FALSE
      `,
      [project_id]
    );

    // Create response data.
    const tasks_by_id = {};
    tasksRes.rows.forEach(task => {
      tasks_by_id[task.task_id] = task;
    });
    res.locals.output = {
      result: { ...projectRes.rows[0], tasks_by_id }
    };
    res.locals.backgroundInput = { project_id };
  }
).background(async (req, res) => {
  const { user_id } = res.locals;
  const { project_id } = res.locals.input;

  const openedRes = await query(
    `
      INSERT INTO project_opens (user_id, project_id, opened_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT
        ON CONSTRAINT project_opens_pkey
        DO UPDATE
          SET opened_at = NOW()
      RETURNING opened_at
    `,
    [user_id, project_id]
  );
  // console.log(openedRes.rows[0].opened_at);
});
