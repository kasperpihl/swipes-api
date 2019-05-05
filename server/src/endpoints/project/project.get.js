import { query } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
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
        SELECT project_id, title, due_date, ordering, indention, completion, rev, owned_by, members, completion_percentage, privacy
        FROM projects
        WHERE project_id = $1
        AND deleted = FALSE
      `,
      [project_id]
    );

    if (!projectRes || !projectRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    const tasksRes = await query(
      `
        SELECT task_id, title, due_date, assignees, attachment
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
      project: { ...projectRes.rows[0], tasks_by_id }
    };
    res.locals.backgroundInput = { project_id };
  }
);
