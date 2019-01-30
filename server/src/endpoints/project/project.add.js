import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import { string, array, any } from 'valjs';

const expectedInput = {
  name: string.min(1).require(),
  owned_by: string.require(),
  privacy: any.of('public', 'private'),
  followers: array.of(string)
};

export default endpointCreate(
  {
    expectedInput,
    permissionCreateKey: 'owned_by'
  },
  async (req, res) => {
    const { user_id, input } = res.locals;
    const { name, owned_by } = input;

    const projectId = idGenerate('P', 15);
    const [projectRes] = await transaction([
      sqlInsertQuery('projects', {
        owned_by,
        name,
        project_id: projectId,
        created_by: user_id
      }),
      sqlInsertQuery('project_tasks', {
        project_id: projectId
      }),
      {
        text: `INSERT into permissions (permission_from, granted_to, owned_by) VALUES ($1, $2, $3)`,
        values: [projectId, user_id, owned_by]
      }
    ]);

    res.locals.output = {
      updates: [{ type: 'project', data: projectRes.rows[0] }]
    };
  }
);
