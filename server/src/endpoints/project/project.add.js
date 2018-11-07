import endpointCreate from 'src/utils/endpointCreate';
import { query } from 'src/utils/db/db';
import idGenerate from 'src/utils/idGenerate';

const expectedInput = {};

export default endpointCreate(
  {
    expectedInput
  },
  async (req, res, next) => {
    const { user_id } = res.locals;

    // Add new project
    await query('INSERT INTO projects (id, created_by) VALUES ($1, $2)', [
      idGenerate('P'),
      user_id
    ]);

    // Create response data.
    res.locals.output = {};
  }
).background(async (req, res) => {});
