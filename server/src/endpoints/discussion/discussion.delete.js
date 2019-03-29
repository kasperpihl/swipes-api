import { string } from 'valjs';
import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

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
    await transaction([
      {
        text: `
          DELETE from discussions
          WHERE discussion_id = $1
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
  }
);
