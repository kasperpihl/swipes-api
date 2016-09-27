import config from 'config';
import validator from 'validator';
import r from 'rethinkdb';
import jwt from 'jwt-simple';
import sha1 from 'sha1';
import moment from 'moment';
import db from '../db.js';
import SwipesError from '../swipes-error.js';
import { generateSlackLikeId } from '../util.js';

const signUpValidate = (req, res, next) => {
  const errors = [];

  let {
    email,
    name,
    password,
    repassword,
    organization
  } = req.body;

  email = email ? validator.trim(email.toLowerCase()) : '';
  name = validator.trim(name);
  password = password || '';
  repassword = repassword || '';
  organization = organization || '';

  // Because we are cool!
  if (!email.includes('@')) {
    email = email + '@swipesapp.com';
  }

  if (!validator.isEmail(email)) {
    errors.push({
      field: 'email',
      message: 'Ivalid email!'
    });
  }

  if (validator.isNull(name)) {
    errors.push({
      field: 'username',
      message: 'The username cannot be empty!'
    });
  }

  if (validator.isNull(password)) {
    errors.push({
      field: 'password',
      message: 'The password cannot be empty!'
    });
  }

  if (!validator.equals(password, repassword)) {
    errors.push({
      field: 'repassword',
      message: 'The passwords must match!'
    });
  }

  if (validator.isNull(organization)) {
    errors.push({
      field: 'organization',
      message: 'Organization is required!'
    });
  }

  if (errors.length > 0) {
    return next(new SwipesError(errors));
  } else {
    res.locals.email = email;
    res.locals.name = name;
    res.locals.password = password;
    res.locals.organization = organization;

    return next();
  }
}

const userAvailability = (req, res, next) => {
  const {
    email,
    name
  } = res.locals;
  const query = r.do(
    r.table('users').getAll(email, {index: 'email'}).isEmpty(),
    r.table('users').getAll(name, {index: 'name'}).isEmpty(),
    (isEmail, isName) => {
      return r.expr([isEmail, isName])
    }
  )

  db.rethinkQuery(query)
    .then((results) => {
      if (!results[0]) {
        const error = {
          err: 'There is a user with that email.',
          errors: [{field: 'email', message: 'There is a user with that email.'}]
        }

        return next(new SwipesError(error));
      } else if (!results[1]) {
        const error = {
          err: 'This username is not available.',
          errors: [{field: 'username', message: 'This username is not available.'}]
        }

        return next(new SwipesError(error));
      } else {
        return next();
      }
    })
    .catch((err) => {
      return next(err);
    })
}

const userAddToOrganization = (req, res, next) => {
  const {
    organization
  } = res.locals;
  const organizationId = generateSlackLikeId('O');
  const userId = generateSlackLikeId('U');
  const insertDoc = {
    id: organizationId,
    name: organization,
    users: [userId]
  }
  const checkQ = r.table('organizations').getAll(organization, {index: 'name'});
  const insertQ = r.table('organizations').insert(insertDoc);

  db.rethinkQuery(checkQ)
    .then((organizations) => {
      if (organizations.length > 0) {
        const organization = organizations[0];
        const updateQ = r.table('organizations').update({
          users: r.row('users').append(userId)
        });

        res.locals.organizationId = organization.id;

        return db.rethinkQuery(updateQ);
      }

      res.locals.organizationId = organizationId;

      return db.rethinkQuery(insertQ);
    })
    .then(() => {
      res.locals.userId = userId;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const userSignUp = (req, res, next) => {
  const {
    email,
    name,
    password,
    organizationId,
    userId
  } = res.locals;
  const userDoc = {
    id: userId,
    apps: [],
    services:[],
    organizations: [organizationId],
    email: email,
    name: name,
    password: sha1(password),
    created: moment().unix()
  }
  const createUserQ = r.table('users').insert(userDoc);
  const token = jwt.encode({
    iss: userId
  }, config.get('jwtTokenSecret'))

  db.rethinkQuery(createUserQ)
    .then(() => {
      res.locals.userId = userId;
      res.locals.token = token;

      return next();
    }).catch((err) => {
      return next(err);
    });
}

const  signInValidate = (req, res, next) => {
  let {
    email,
    password
  } = req.body;

  email = email ? validator.trim(email.toLowerCase()) : '';
  password = password ? sha1(req.body.password) : '';

  // Because we are cool!
  if (!email.includes('@')) {
    email = email + '@swipesapp.com';
  }

  if (!validator.isEmail(email)) {
    const error = {
      err: 'Invalid email!',
      errors: [{field: 'email', message: 'Invalid email!'}]
    }

    return next(new SwipesError(error));
  }

  res.locals.email = email;
  res.locals.password = password;

  return next();
}

const userSignIn = (req, res, next) => {
  const {
    email,
    password
  } = res.locals;
  const query = r.table('users').filter({
    email: email
  }).map((user) => {
    return {
      id: user('id'),
      password: user('password'),
      is_admin: user("is_admin").default(false)
    }
  });

  db.rethinkQuery(query)
    .then((users) => {
      let user = users[0];

      if (users.length === 0) {
        const error = {
          err: 'Incorrect email.',
          errors: [{field: 'email', message: 'Incorrect email.'}]
        }

        return next(new SwipesError(error));
      } else if (password !== user.password) {
        const error = {
          err: 'Incorrect password.',
          errors: [{field: 'password', message: 'Incorrect password.'}]
        }

        return next(new SwipesError(error));
      } else {
        const token = jwt.encode({
          iss: user.id,
          adm: user.is_admin,
          sysAdm: user.is_sysadmin
        }, config.get('jwtTokenSecret'))

        res.locals.token = token;

        return next();
      }
    }).catch((err) => {
      return next(err);
    });
}

export {
  signUpValidate,
  userAvailability,
  userSignUp,
  userAddToOrganization,
  signInValidate,
  userSignIn
}
