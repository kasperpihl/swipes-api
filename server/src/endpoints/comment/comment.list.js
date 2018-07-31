import r from 'rethinkdb';
import { object, array, string, number } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  discussion_id: string.require(),
  skip: number.gte(0),
  limit: number.gte(1).lte(100),
  organization_id: string.require(),
};
const expectedOutput = {
  comments: array.of(object),
};

export default endpointCreate({
  endpoint: '/comment.list',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;

  const skip = input.skip || 0;
  const limit = input.limit || 20;

  const q = r.table('comments')
              .orderBy({ index: r.desc('sent_at') })
              .filter({
                organization_id: input.organization_id,
                discussion_id: input.discussion_id,
              })
              .slice(skip, skip + limit)

  let comments = await dbRunQuery(q);
  let has_more = false;
  if(comments.length >= limit + 1) {
    has_more = true;
    comments = comments.slice(0, limit);
  }
  // Create response data.
  res.locals.output = {
    comments,
    skip,
    limit,
    has_more,
  };
});
