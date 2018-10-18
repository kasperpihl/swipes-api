const { Pool } = require('pg');

const pool = new Pool({
  host: 'workspace.cuaunhcnlbha.us-east-1.rds.amazonaws.com',
  port: 5432,
  user: 'postgres',
  password: 'GAze0UGQyj',
  database: 'workspace',
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
