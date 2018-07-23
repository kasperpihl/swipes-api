import r from 'rethinkdb';
import dbRunQuery from './dbRunQuery';

export default (orgId) => dbRunQuery(
  r.table('organizations').get(orgId)('active_users')
)