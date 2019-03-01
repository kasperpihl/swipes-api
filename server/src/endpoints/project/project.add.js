import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import update from 'src/utils/update';
import { string, array, any } from 'valjs';

const expectedInput = {
  title: string.min(1).require(),
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
    const { user_id } = res.locals;
    const {
      title,
      owned_by,
      followers = [],
      privacy = 'public'
    } = res.locals.input;

    const projectId = idGenerate('PROJ-', 15);

    const userIds = [...new Set(followers).add(user_id)];

    const [projectRes] = await transaction([
      sqlInsertQuery('projects', {
        owned_by,
        title,
        project_id: projectId,
        created_by: user_id
      }),
      sqlInsertQuery('project_tasks', {
        project_id: projectId
      }),
      sqlPermissionInsertQuery(projectId, privacy, owned_by, userIds)
    ]);

    res.locals.update = update.prepare(projectId, [
      { type: 'project', data: projectRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
