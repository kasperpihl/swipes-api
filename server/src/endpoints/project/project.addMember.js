import { string } from 'valjs';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import sqlToIsoString from 'src/utils/sql/sqlToIsoString';
import userTeamCheck from 'src/utils/userTeamCheck';
import sqlPermissionInsertQuery from 'src/utils/sql/sqlPermissionInsertQuery';
import { query, transaction } from 'src/utils/db/db';
import update from 'src/utils/update';
import channelAddSystemMessage from 'src/utils/channel/channelAddSystemMessage';

const expectedInput = {
  project_id: string.require(),
  target_user_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'project_id'
  },
  async (req, res) => {
    // Get inputs
    const { project_id, target_user_id } = res.locals.input;

    const projectRes = await query(
      `SELECT privacy, owned_by FROM projects WHERE project_id = $1`,
      [project_id]
    );
    const proj = projectRes.rows[0];

    // Check that target user exists and is not owner.
    await userTeamCheck(target_user_id, proj.owned_by);

    if (proj.privacy === 'public') {
      throw Error('Project is public').toClient();
    }

    const [projectUpdateRes] = await transaction([
      {
        text: `
          UPDATE projects
          SET
            updated_at = now(),
            members = members || jsonb_build_object('${target_user_id}', ${sqlToIsoString(
          'now()'
        )})
          WHERE project_id = $1
          RETURNING members, updated_at, project_id
        `,
        values: [project_id]
      },
      sqlPermissionInsertQuery(project_id, proj.privacy, proj.owned_by, [
        target_user_id
      ])
    ]);

    res.locals.backgroundInput = {
      target_user_id,
      project: proj
    };

    res.locals.update = update.prepare(project_id, [
      { type: 'project', data: projectUpdateRes.rows[0] }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);

  const { user_id } = res.locals;

  const userRes = await query(
    `
      SELECT first_name
      FROM users
      WHERE user_id = $1
    `,
    [user_id]
  );
  const user = userRes.rows[0];

  const { target_user_id, project } = res.locals.input;
  if (project.owned_by.startsWith('U')) {
    return;
  }
  channelAddSystemMessage(
    project.owned_by,
    target_user_id,
    `You have been added by ${user.first_name} to the project ${project.title}`
  );
});
