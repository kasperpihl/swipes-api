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
}, async (req, res) => {
  // Get inputs
  const input = res.locals.input;
  
  const skip = input.skip || 0;
  const limit = input.limit || 20;
  let query;

  if(input.type === 'sent') {
    query = r.table('pings')
              .orderBy({ index: r.desc('sent_at') })
              .slice(skip, skip + limit)
              .filter({
                created_by: res.locals.user_id,
                organization_id: input.organization_id,
              })
              .merge(ping => ({
                receivers: r.table('ping_receivers')
                            .getAll(ping('id'), { index: 'ping_id' })
                            .pluck('received_by', 'read_at', 'thanked_at')
                            .coerceTo('array')
              }));
  } else {
    // OMG RETHINKDB : A join counts on the skip and limit, so we have to double.......... facepalm
    query = r.table('ping_receivers')
              .orderBy({ index: r.desc('sent_at') })
              .slice(skip * 2, skip * 2 + limit * 2)
              .filter({
                received_by: res.locals.user_id,
                organization_id: input.organization_id,
              })
              .eqJoin('ping_id', r.table('pings'), { ordered: true })
              .map((obj) => obj('right').merge({
                receiver: obj('left'),
              }))
              .merge(obj => ({
                receivers: r.table('ping_receivers')
                            .getAll(obj('id'), { index: 'ping_id' })
                            .pluck('received_by', 'read_at', 'thanked_at')
                            .coerceTo('array')
              }));
  }

  const pings = await dbRunQuery(query);

  // Create response data.
  res.locals.responseData = {
    skip,
    limit,
    pings
  };
});
