import r from 'rethinkdb';
import { object, array, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  discussion_id: string.require(),
};
const expectedOutput = {
  discussion: object.require(),
};

export default endpointCreate({
  endpoint: '/discussion.get',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  const q = r.table('discussions')
            .get(input.discussion_id)

  const discussion = await dbRunQuery(q);
  // Create response data.
  res.locals.output = {
    discussion,
  };
});
