import r from 'rethinkdb';
import rp from 'request-promise';
import db from '../db/';

const rpap = rp.defaults({
  // baseUrl: 'https://staging.swipesapp.com/v1',
  baseUrl: 'http://localhost:5000/v1',
  json: true,
});
const locals = {};

const updateLocals = (res, fields) => {
  fields.forEach((field) => {
    locals[field] = res[field];

    delete res[field];
  });

  return res;
};

const clearDatabase = () => {
  const q = r.table('users').get(locals.user_id).delete();

  return db.rethinkQuery(q);
};

afterAll(() => {
  return clearDatabase();
});

test('sign up new user', () => {
  return rpap.post({
    url: '/users.signup',
    body: {
      email: 'tihomir+jest@swipesapp.com',
      password: 'jestit',
      first_name: 'Jest',
      last_name: 'Jestov',
    },
  })
    .then((result) => {
      expect(updateLocals(result, ['token', 'user_id'])).toMatchSnapshot();
    });
});
