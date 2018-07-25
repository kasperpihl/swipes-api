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
  const { user_id } = res.locals;
  const { discussion_id } = res.locals.input;

  const q = r.table('discussions')
            .get(discussion_id)
            .merge(obj => ({
              subscription: r.table('discussion_followers')
                .get(obj('id').add(`-${user_id}`)),
              followers: r.table('discussion_followers')
                .getAll(obj('id'), { index: 'discussion_id' })
                .map(u => u('user_id'))
                .coerceTo('array'),
            }));

  const discussion = await dbRunQuery(q);
  // Create response data.
  res.locals.output = {
    discussion,
  };
});
