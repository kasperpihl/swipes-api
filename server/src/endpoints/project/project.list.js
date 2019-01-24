import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';
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
        WHERE ${sqlCheckPermissions('per.granted_to', user_id)}
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
