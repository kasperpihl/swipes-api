import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import idGenerate from 'src/utils/idGenerate';
import sqlInsertQuery from 'src/utils/sql/sqlInsertQuery';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';

import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import update from 'src/utils/update';
import { string, array, any } from 'valjs';

const expectedInput = {
  title: string.min(1).require(),
  owned_by: string.require(),
  privacy: any.of('public', 'private'),
  members: array.of(string)
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
      members = [],
      privacy = 'public'
    } = res.locals.input;

    const projectId = idGenerate('P', 8, true);

    const userIds = [...new Set(members).add(user_id)];

    const memberString = `jsonb_build_object(
      ${userIds.map(uId => `'${uId}', ${sqlToIsoString('now()')}`).join(', ')}
    )`;

    const [projectRes] = await transaction([
      sqlInsertQuery(
        'projects',
        {
          owned_by,
          title,
          project_id: projectId,
          created_by: user_id,
          privacy,
          members: privacy === 'private' ? memberString : null
        },
        {
          dontPrepare: { members: true }
        }
      ),
      sqlInsertQuery('project_tasks', {
        project_id: projectId
      }),
      sqlPermissionInsertQuery(projectId, privacy, owned_by, userIds)
    ]);

    res.locals.update = update.prepare(projectId, [
      { type: 'project', data: projectRes.rows[0] }
    ]);
    res.locals.output = {
      project_id: projectId
    };
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
