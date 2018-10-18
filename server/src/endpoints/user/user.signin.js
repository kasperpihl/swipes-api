import { array, string, any } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbPool from 'src/utils/db/dbPool';

const expectedInput = {};

export default endpointCreate(
  {
    endpoint: '/user.signin',
    expectedInput,
    type: 'notAuthed',
  },
  async (req, res, next) => {
    // const { user_id } = res.locals;
    // const { title, privacy, organization_id } = res.locals.input;

    const dbres = await dbPool.query('SELECT $1::text as message', [
      'Hello world!',
    ]);

    console.log(dbres, 'dbres');

    // Create response data.
    res.locals.output = {
      dbres,
      wearehere: 'lalala',
    };
  },
).background(async (req, res) => {});
