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
  
  let query = r.table(input.type === 'sent' ? 'pings' : 'ping_receivers')
                .orderBy({ index: r.desc('sent_at') })
                .skip(input.skip || 0)
                .limit(input.limit || 20);

  if(input.type === 'sent') {
    query = query.filter({
      created_by: res.locals.user_id,
      organization_id: input.organization_id,
    });
  } else {
    query = query.filter({
      received_by: 'hello',
      organization_id: input.organization_id,
    }).eqJoin('ping_id', r.table('pings')).map((obj) => obj('right').merge({
      receiver: obj('left'),
    }));
  }

  const pings = await dbRunQuery(query);



  // Create response data.
  res.locals.responseData = {
    pings
  };
});
