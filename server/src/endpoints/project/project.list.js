import endpointCreate from 'src/utils/endpointCreate';
import { query } from 'src/utils/db/db';

const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    const { user_id } = res.locals;
    const projectQuery = {
      text: `
        SELECT project_id, name, due_date, owned_by, completion_percentage
        FROM projects
        WHERE project_id
        IN (
          SELECT project_id
          FROM project_permissions
          WHERE granted_to
          IN (
            SELECT permission_to
            FROM permissions
            WHERE user_id = $1
          )
        )
        AND deleted=FALSE
      `,
      values: [user_id]
    };
    const projectRes = await query(projectQuery);
    // Create response data.
    res.locals.output = { projects: projectRes.rows };
  }
);
