// "UB9BXJ1JB"
import r from 'rethinkdb';
import { string, any, number } from 'valjs';
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
}, async (req, res, next) => {
  // Get inputs
  const { input, user_id } = res.locals;
  const {
    type,
    organization_id,
  } = input;
  let {
    skip,
    limit,
  } = input;
  let q = r.table('discussions')
    .orderBy({ index: r.desc('last_comment_at') });

  skip = skip || 0;
  limit = limit || 20;

  if (type === 'by me') {
    q = q.filter({
      archived: false,
      created_by: user_id,
    });
  } else if (type === 'following') {
    q = q.filter(disc =>
      disc('organization_id')
        .eq(organization_id)
        .and(r.table('discussion_followers')
          .get(disc('id').add(`-${user_id}`)))
        .and(disc('archived').eq(false)));
  } else if (type === 'all other') {
    q = q.filter(disc =>
      disc('organization_id')
        .eq(organization_id)
        .and(disc('privacy').eq('public'))
        .and(r.table('discussion_followers')
          .get(disc('id').add(`-${user_id}`))
          .not())
        .and(disc('archived').eq(false)));
  }
  q = q.slice(skip, skip + limit)
    .merge(obj => ({
      status: r.table('discussion_followers')
        .get(obj('id').add(`-${user_id}`)),
      followers: r.table('discussion_followers')
        .getAll(obj('id'), { index: 'discussion_id' })
        .map(u => u('user_id'))
        .coerceTo('array'),
    }));


  const discussions = await dbRunQuery(q);

  // Create response data.
  res.locals.output = { discussions };
});
