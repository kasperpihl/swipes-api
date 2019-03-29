import { string } from 'valjs';
import { transaction } from 'src/utils/db/db';

import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';

const expectedInput = {
  project_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'project_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { user_id } = res.locals;
    const { project_id } = res.locals.input;

    const [projectRes] = await transaction([
      {
        text: `
        UPDATE projects
        SET
          updated_at = now(),
          members = jsonb_strip_nulls(
            members || jsonb_build_object('${user_id}', null)
          ) 
        WHERE project_id = $1
        RETURNING members, project_id, last_comment_at
      `,
        values: [project_id]
      },
      {
        text: `
          DELETE FROM permissions
          WHERE permission_from = $1
          AND granted_to = $2 
        `,
        values: [project_id, user_id]
      }
    ]);

    res.locals.update = update.prepare(project_id, [
      { type: 'project', data: projectRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
