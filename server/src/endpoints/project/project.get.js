import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpointCreate';
import { string } from 'valjs';

const expectedInput = {
  project_id: string.require()
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id } = res.locals;
    const { project_id } = res.locals.input;

    const projectRes = await query(
      `
        SELECT p.project_id, p.name, p.discussion_id, p.due_date, p.ordering, p.indention, p.completion, p.rev, p.owned_by, p.completion_percentage
        FROM project_permissions
        AS pp
        INNER JOIN projects
        AS p
        ON pp.project_id = p.project_id
        WHERE pp.project_id = $1
        AND pp.granted_to = (
          SELECT permission_to
          FROM permissions
          WHERE user_id = $2
        )
        AND p.deleted = FALSE
      `,
      [project_id, user_id]
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
  console.log(openedRes.rows[0].opened_at);
});
