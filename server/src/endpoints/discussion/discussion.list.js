// "UB9BXJ1JB"
import r from 'rethinkdb';
import { object, array, string, any, number } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  type: any.of('by me', 'following', 'all other').require(),
  skip: number.gte(0),
  limit: number.gte(1).lte(100),
  organization_id: string.require(),
};
const expectedOutput = {};

export default endpointCreate({
  endpoint: '/discussion.list',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;
  let q = r.table('discussions')
          .orderBy({ index: r.desc('last_comment_at') });

  const skip = input.skip || 0;
  const limit = input.limit || 20;

  if(input.type === 'by me') {
    q = q.filter({
      created_by: res.locals.user_id,
    });
  } else if (input.type === 'following') {
    q = q.filter(disc => 
          disc('organization_id')
          .eq(input.organization_id)
          .and(
            r.table('discussion_followers')
            .get(disc('id').add(`-${res.locals.user_id}`))
          )
        );
  } else if (input.type === 'all other') {
    q = q.filter(disc => 
          disc('organization_id')
          .eq(input.organization_id)
          .and(
            disc('privacy').eq('public')
          )
          .and(
            r.table('discussion_followers')
            .get(disc('id').add(`-${res.locals.user_id}`))
            .not()
          )
        );
  }
  q = q.slice(skip, skip + limit)
      .merge(obj => ({
        status: r.table('discussion_followers')
                  .get(obj('id').add(`-${res.locals.user_id}`)),
        followers: r.table('discussion_followers')
                    .getAll(obj('id'), { index: 'discussion_id' })
                    .limit(4)
                    .map(u => u('user_id'))
                    .coerceTo('array')
      }));



  const discussions = await dbRunQuery(q);

  // Create response data.
  res.locals.output = { discussions };
});
