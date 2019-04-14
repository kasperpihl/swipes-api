import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlCheckPermissions from 'src/utils/sql/sqlCheckPermissions';
import { query } from 'src/utils/db/db';

const expectedInput = {
  owned_by: string
};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { owned_by } = input;

    const skip = input.skip || 0;
    const limit = input.limit || 20;

    const values = [user_id, limit + 1, skip];

    let ownedByFilter = '';
    if (owned_by) {
      ownedByFilter = `AND p.owned_by = $${values.push(owned_by)}`;
    }

    const projectQuery = {
      text: `
        SELECT p.project_id, p.title, p.due_date, p.owned_by, p.completion_percentage, p.privacy, per.granted_at, po.opened_at
        FROM permissions as per
        INNER JOIN projects as p
        ON p.project_id = per.permission_from
        LEFT OUTER JOIN project_opens as po
        ON p.project_id = po.project_id AND po.user_id = $1
        WHERE ${sqlCheckPermissions('per.granted_to', user_id)}
        ${ownedByFilter}
        AND p.deleted=FALSE
        ORDER BY
          po.opened_at DESC NULLS FIRST,
          p.created_at DESC
        LIMIT $2
        OFFSET $3
      `,
      values
    };
    const projectRes = await query(projectQuery);

    const has_more = projectRes.rows.length > limit;
    const projects = projectRes.rows.slice(0, limit);
    // Create response data.
    res.locals.output = { projects, skip, limit, has_more };
  }
);
