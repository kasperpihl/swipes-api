import { string } from 'valjs';
import { query } from 'src/utils/db/db';
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
    const { user_id } = res.locals;
    const { project_id } = res.locals.input;

    await query(
      `
      INSERT INTO project_opens (user_id, project_id, opened_at)
      VALUES ($1, $2, NOW())
      ON CONFLICT
        ON CONSTRAINT project_opens_pkey
        DO UPDATE
          SET opened_at = NOW()
      RETURNING opened_at
    `,
      [user_id, project_id]
    );
  }
);
