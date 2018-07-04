import r from 'rethinkdb';
import { number, array, any, string } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {
  type: any.of('received', 'sent'),
  skip: number.gte(0),
  limit: number.gte(1).lte(100),
  organization_id: string.require(),
};
const expectedOutput = {
  pings: array.require()
};

export default endpointCreate({
  endpoint: '/ping.list',
  expectedInput,
  expectedOutput
}, async (req, res, next) => {
  // Get inputs
  const input = res.locals.input;
  
  const skip = input.skip || 0;
  const limit = input.limit || 20;
  let query = r.table(input.type === 'sent' ? 'pings' : 'ping_receivers')
                .orderBy({ index: r.desc('sent_at') })

  if(input.type === 'sent') {
    query = query.slice(skip, skip + limit)
                  .filter({
                    created_by: res.locals.user_id,
                    organization_id: input.organization_id,
                  });
  } else {
    // OMG RETHINKDB : A join counts on the skip, so we have to double for received..........
    query = query.slice(skip * 2, skip * 2 + limit * 2)
                  .filter({
                    received_by: 'hello',
                    organization_id: input.organization_id,
                  })
                  .eqJoin('ping_id', r.table('pings'), { ordered: true })
                  .map((obj) => obj('right').merge({
                    receiver: obj('left'),
                  }))
                  .pluck('sent_at');
  }

  const pings = await dbRunQuery(query);

  // Create response data.
  res.locals.responseData = {
    skip,
    limit,
    pings
  };
});
