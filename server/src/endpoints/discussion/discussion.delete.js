import { string } from 'valjs';
import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';
import update from 'src/utils/update';

const expectedInput = {
  discussion_id: string.require()
};

export default endpointCreate(
  {
    expectedInput,
    permissionKey: 'discussion_id'
  },
  async (req, res, next) => {
    // Get inputs
    const { discussion_id } = res.locals.input;
    const [discussionRes] = await transaction([
      {
        text: `
          DELETE from discussions
          WHERE discussion_id = $1
          RETURNING discussion_id
        `,
        values: [discussion_id]
      },
      {
        text: `
          DELETE from permissions
          WHERE permission_from = $1
        `,
        values: [discussion_id]
      }
    ]);

    if (!discussionRes.rows.length) {
      throw Error('Not found')
        .code(404)
        .toClient();
    }

    // Create response data.
    res.locals.update = update.prepare(discussion_id, [
      {
        type: 'discussion',
        data: {
          ...discussionRes.rows[0],
          deleted: true
        }
      }
    ]);
  }
).background(async (req, res) => {
  await update.send(res.locals.update);
});
