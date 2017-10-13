import r from 'rethinkdb';
import Promise from 'bluebird';
import rp from 'request-promise';
import db from '../db/';

const rpap = rp.defaults({
  // baseUrl: 'https://staging.swipesapp.com/v1',
  baseUrl: 'http://localhost:5000/v1',
  json: true,
});
const locals = {};

// const deleteProps
const updateLocals = (res, fields) => {
  fields.forEach((field) => {
    if (typeof field === 'object') {
      locals[field.key] = res[field.value];
      delete res[field.value];
    } else {
      locals[field] = res[field];
      delete res[field];
    }
  });

  return res;
};

const clearDatabase = () => {
  const organization_id = locals.organization.id;
  const clearUserQ = r.table('users').filter({
    email: 'tihomir+jest@swipesapp.com',
  }).delete();
  const clearUser2Q = r.table('users').filter({
    email: 'tihomir+jest2@swipesapp.com',
  }).delete();
  const clearUser3Q = r.table('users').filter({
    email: 'tihomir+jest3@swipesapp.com',
  }).delete();
  const clearOrganizationQ = r.table('organizations').get(organization_id).delete();
  const clearPostsQ = r.table('posts').filter({ organization_id }).delete();
  const clearMilestonesQ = r.table('milestones').filter({ organization_id }).delete();
  const clearGoalsQ = r.table('goals').filter({ organization_id }).delete();
  const promises = [
    db.rethinkQuery(clearUserQ),
    db.rethinkQuery(clearUser2Q),
    db.rethinkQuery(clearUser3Q),
    db.rethinkQuery(clearOrganizationQ),
    db.rethinkQuery(clearPostsQ),
    db.rethinkQuery(clearMilestonesQ),
    db.rethinkQuery(clearGoalsQ),
  ];

  console.log('CLEANING');

  return Promise.all(promises);
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
      expect(result).toMatchObject({
        token: expect.any(String),
        user_id: expect.any(String),
      });
      expect(updateLocals(result, ['token', 'user_id'])).toMatchSnapshot();
    });
});

test('creating organization', () => {
  return rpap.post({
    url: '/organizations.create',
    body: {
      organization_name: 'Jest Org',
      token: locals.token,
    },
  })
    .then((result) => {
      expect(result).toMatchObject({
        organization: expect.any(Object),
      });
      expect(updateLocals(result, ['organization'])).toMatchSnapshot();
    });
}, 60000);

test('inviting user', () => {
  return rpap.post({
    url: '/organizations.inviteUser',
    body: {
      organization_id: locals.organization.id,
      first_name: 'Jest2',
      email: 'tihomir+jest2@swipesapp.com',
      token: locals.token,
    },
  })
    .then((result) => {
      expect(result).toMatchObject({
        user: expect.any(Object),
        invitation_token: expect.any(String),
        organization: expect.any(Object),
      });
      expect(updateLocals(result, ['user', 'invitation_token', 'organization'])).toMatchSnapshot();
    });
}, 10000);

test('sign up with invitation token', () => {
  return rpap.post({
    url: '/users.signup',
    body: {
      email: 'tihomir+jest2@swipesapp.com',
      password: 'jestit2',
      first_name: 'Jest2',
      last_name: 'Jestov2',
      invitation_token: locals.invitation_token,
    },
  })
    .then((result) => {
      expect(result).toMatchObject({
        token: expect.any(String),
        user_id: expect.any(String),
      });

      delete result.user_id;
      delete result.token;

      expect(result).toMatchSnapshot();
    });
});

test('organization join', () => {
  let user_3_token = null;

  return rpap.post({
    url: '/users.signup',
    body: {
      email: 'tihomir+jest3@swipesapp.com',
      password: 'jestit',
      first_name: 'Jest',
      last_name: 'Jestov',
    },
  })
    .then((result) => {
      user_3_token = result.token;

      return rpap.post({
        url: '/organizations.inviteUser',
        body: {
          organization_id: locals.organization.id,
          first_name: 'Jest2',
          email: 'tihomir+jest3@swipesapp.com',
          token: locals.token,
        },
      });
    })
    .then((result) => {
      return rpap.post({
        url: '/organizations.join',
        body: {
          organization_id: locals.organization.id,
          token: user_3_token,
        },
      })
        .then((result) => {
          expect(result).toMatchObject({
            organization: expect.any(Object),
          });
          expect(updateLocals(result, ['organization'])).toMatchSnapshot();
        });
    });
}, 20000);

test('init', () => {
  return rpap.post({
    url: '/init',
    body: {
      timestamp: null,
      token: locals.token,
    },
  })
    .then((result) => {
      expect(result).toMatchObject({
        me: expect.any(Object),
        timestamp: expect.any(String),
        full_fetch: expect.any(Boolean),
        sofi: expect.any(Object),
        // users: expect.any(Array),
        // goals: expect.any(Array),
        // milestones: expect.any(Array),
        // ways: expect.any(Array),
        // notes: expect.any(Array),
        // posts: expect.any(Array),
        // services: expect.any(Array),
        // notifications: expect.any(Array),
        // onboarding: expect.any(Array),
        // pending_organizations: expect.any(Array),
      });
    });
}, 10000);

test('milestone create', () => {
  return rpap.post({
    url: '/milestones.create',
    body: {
      title: 'Test milestone',
      organization_id: locals.organization.id,
      token: locals.token,
    },
  })
    .then((result) => {
      const milestone = updateLocals(result.milestone, [{
        key: 'milestone_id',
        value: 'id',
      }, 'updated_at', 'created_at', 'created_by', 'organization_id', 'history']);

      result.milestone = milestone;
      expect(result).toMatchSnapshot();
    });
});

test('goal create', () => {
  return rpap.post({
    url: '/goals.create',
    body: {
      goal: {
        title: 'Test goal',
        assignees: [locals.user_id],
      },
      organization_id: locals.organization.id,
      token: locals.token,
    },
  })
    .then((result) => {
      const goal = updateLocals(result.goal, [{
        key: 'goal_id',
        value: 'id',
      }, 'updated_at', 'created_at', 'created_by', 'organization_id', 'history', 'assignees']);

      result.goal = goal;
      expect(result).toMatchSnapshot();
    });
}, 10000);

test('post create type post', () => {
  return rpap.post({
    url: '/posts.create',
    body: {
      message: 'test post',
      organization_id: locals.organization.id,
      type: 'post',
      token: locals.token,
    },
  })
    .then((result) => {
      const post = updateLocals(result.post, [{
        key: 'post_id',
        value: 'id',
      }, 'updated_at', 'created_at', 'created_by', 'organization_id', 'followers']);

      result.post = post;
      expect(result).toMatchSnapshot();
    });
}, 10000);

test('sign in', () => {
  return rpap.post({
    url: '/users.signin',
    body: {
      email: 'tihomir+jest@swipesapp.com',
      password: 'jestit',
    },
  })
    .then((result) => {
      expect(result).toMatchObject({
        token: expect.any(String),
      });

      expect(updateLocals(result, ['token'])).toMatchSnapshot();
    });
});

test('sign out', () => {
  return rpap.post({
    url: '/users.signout',
    body: {
      token: locals.token,
    },
  })
    .then((result) => {
      expect(result).toMatchSnapshot();
    });
});
