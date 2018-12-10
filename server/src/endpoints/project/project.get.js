import endpointCreate from 'src/utils/endpointCreate';
import { query } from 'src/utils/db/db';
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
        SELECT p."project_id", p."name", p."discussion_id", p."due_date", p."ordering", p."indention", p."completion", p."rev"
        FROM project_permissions
        AS pp
        LEFT JOIN projects
        AS p
        ON pp.project_id = p.project_id
        WHERE pp.project_id = $1
        AND pp.granted_to = (
          SELECT permission_id
          FROM permissions
          WHERE user_id = $2
        )
        AND deleted = FALSE
      `,
      [project_id, user_id]
    );

    console.log('project', projectRes.rows.length);
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
  }
);
