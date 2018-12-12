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
        SELECT p.project_id, p.name, p.due_date, p.owned_by, p.completion_percentage, p.created_at, po.opened_at
        FROM projects p
        LEFT OUTER JOIN project_opens as po
        ON p.project_id = po.project_id AND po.user_id = $1
        WHERE p.project_id
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
