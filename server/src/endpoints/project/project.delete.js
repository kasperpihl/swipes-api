import { string } from 'valjs';
import { transaction } from 'src/utils/db/db';
import endpointCreate from 'src/utils/endpoint/endpointCreate';

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
    const { project_id } = res.locals.input;
    await transaction([
      {
        text: `
          DELETE from projects
          WHERE project_id = $1
        `,
        values: [project_id]
      },
      {
        text: `
          DELETE from permissions
          WHERE permission_from = $1
        `,
        values: [project_id]
      }
    ]);
  }
);
