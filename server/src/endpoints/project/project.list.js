import endpointCreate from 'src/utils/endpointCreate';
import { query } from 'src/utils/db/db';

const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id } = res.locals;
    const projectQuery = {
      text: `
        SELECT p.project_id, p.name, p.due_date, p.owned_by, p.completion_percentage, per.granted_at, po.opened_at
        FROM permissions as per
        INNER JOIN projects as p
        ON p.project_id = per.permission_id
        LEFT OUTER JOIN project_opens as po
        ON p.project_id = po.project_id AND po.user_id = $1
        WHERE per.granted_to
        IN (
          SELECT permission_to
          FROM user_permissions
          WHERE user_id = $1
        )
        AND p.deleted=FALSE
        ORDER BY po.opened_at DESC
      `,
      values: [user_id]
    };
    const projectRes = await query(projectQuery);
    // Create response data.
    res.locals.output = { projects: projectRes.rows };
  }
);
