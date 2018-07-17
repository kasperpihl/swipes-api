import r from 'rethinkdb';
import { object } from 'valjs';
import endpointCreate from 'src/utils/endpointCreate';
import dbRunQuery from 'src/utils/db/dbRunQuery';

const expectedInput = {};
const expectedOutput = {
  me: object.require(),
};

export default endpointCreate({
  endpoint: '/me',
  expectedInput,
  expectedOutput,
}, async (req, res, next) => {
  // Get inputs
  const { user_id } = res.locals;
  const meQ = r.table('users')
                .get(user_id)
                .without(['password', { services: 'auth_data' }])
                .merge({
                  pending_organizations:
                    r.table('organizations')
                      .getAll(r.args(r.row('pending_organizations').default([])))
                      .pluck('id', 'name')
                      .coerceTo('ARRAY'),
                });

  const me = await dbRunQuery(meQ);

  // Create response data.
  res.locals.output = {
    me,
  };
});
