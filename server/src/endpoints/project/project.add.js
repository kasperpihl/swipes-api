import endpointCreate from 'src/utils/endpointCreate';
import db from 'src/utils/db/db';
import idGenerate from 'src/utils/idGenerate';

const expectedInput = {};

export default endpointCreate(
  {
    endpoint: '/project.add',
    expectedInput
  },
  async (req, res, next) => {
    // Add new project
    await db('INSERT INTO projects (id) VALUES ($1)', [idGenerate('P')]);

    // Create response data.
    res.locals.output = {};
  }
).background(async (req, res) => {});
