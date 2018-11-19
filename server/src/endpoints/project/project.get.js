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
      `SELECT "project_id", "name", "discussion_id", "due_date", "order", "indent", "completion", "rev" from projects WHERE project_id = $1 AND deleted = FALSE`,
      [project_id]
    );

    if (!projectRes) {
      throw Error('project_not_found');
    }

    const itemsRes = await query(
      `SELECT "item_id", "title", "due_date" from project_items WHERE "project_id" = $1 AND deleted = FALSE`,
      [project_id]
    );

    // Create response data.
    const itemsById = {};
    itemsRes.rows.forEach(item => {
      itemsById[item.item_id] = item;
    });
    res.locals.output = {
      result: { project: projectRes.rows[0], itemsById }
    };
  }
);
