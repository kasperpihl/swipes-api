import { Pool } from 'pg';

const pool = new Pool({
  host: 'workspace.cuaunhcnlbha.us-east-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'GAze0UGQyj',
  database: 'workspace'
});

export const query = (text, params) => {
  if (typeof text === 'object' && text.text && text.values) {
    return pool.query(text.text, text.values);
  }
  return pool.query(text, params);
};

export const transaction = async queries => {
  if (!Array.isArray(queries)) {
    throw 'db.transaction expects an array of queries';
  }
  // note: we don't try/catch this because if connecting throws an exception
  // we don't need to dispose of the client (it will be undefined)
  const client = await pool.connect();
  const results = [];
  try {
    await client.query('BEGIN');

    for (let i = 0; i < queries.length; i++) {
      let query = queries[i];
      if (typeof query === 'function') {
        query = query(results);
      }

      let text = query;
      let values;
      if (typeof text === 'object') {
        text = query.text;
        values = query.values;
      }

      const res = await client.query(text, values);

      if (typeof query.onSuccess === 'function') {
        query.onSuccess(res);
      }
      results.push(res);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
  return results;
};
