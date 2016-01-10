"use strict";

/*
  T_TODO
  removeUser
  makeAdmin
  allowApps
  invite
  delete
*/

let express = require( 'express' );
let r = require('rethinkdb');
let validator = require('validator');
let moment = require('moment');
let config = require('config');
let util = require('../util.js');
let db = require('../db.js');
let generateId = util.generateSlackLikeId;

let router = express.Router();

router.post('/organizations.create', (req, res, next) => {
  let userId = req.userId;
  let name = validator.trim(req.body.name);

  if (validator.isNull(name)) {
    return res.status(200).json({
      ok: false,
      err: 'name is required!'
    });
  }

  let checkQ =
    r.table('organizations')
      .getAll(name, {index: 'name'})
      .nth(0)
      .default(null);
  let organizationId = generateId('O');
  let organization = {
    id: organizationId,
    name: name,
    ts: moment().unix(),
    users: [
      {
        id: userId,
        is_admin: true
      }
    ]
  };
  let insertQ = r.table('organizations').insert(organization);
  let appendOrganizationQ =
    r.table('users')
      .get(userId)
      .update((user) => {
        return {
          organizations: user('organizations').default([]).append({
            id: organizationId,
            is_admin: true
          })
        }
      });

  db.rethinkQuery(checkQ)
    .then((organization) => {
      if (organization) {
        return res.status(200).json({
          ok: false,
          err: 'There is already an organization with that name!'
        });
      }

      return db.rethinkQuery(r.do(insertQ, appendOrganizationQ));
    })
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
})

router.post('/organizations.join', (req, res, next) => {
  let userId = req.userId;
  // T_TODO make possible to join with organization name too
  let organizationId = req.body.organization_id;

  if (validator.isNull(organizationId)) {
    return res.status(200).json({
      ok: false,
      err: 'organization_id is required!'
    });
  }

  let checkQ =
    r.table('organizations')
      .get(organizationId)('users')
      .map((user) => {
        return user('id')
      })
      .contains(userId)
  let appendOrganizationQ =
    r.table('users')
      .get(userId)
      .update((user) => {
        return {
          organizations: user('organizations').default([]).append({
            id: organizationId
          })
        }
      });
  let appendUserQ =
    r.table('organizations')
      .get(organizationId)
      .update((organization) => {
        return {
          users: organization('users').default([]).append({
            id: userId
          })
        }
      });

  db.rethinkQuery(checkQ)
    .then((isUser) => {
      if (isUser) {
        return res.status(200).json({
          ok: false,
          err: 'You are already part of that organization!'
        });
      }

      return db.rethinkQuery(r.do(appendOrganizationQ, appendUserQ));
    })
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
})

router.post('/organizations.leave', (req, res, next) => {
  let userId = req.userId;
  // T_TODO make possible to leave with organization name too
  let organizationId = req.body.organization_id;

  if (validator.isNull(organizationId)) {
    return res.status(200).json({
      ok: false,
      err: 'organization_id is required!'
    });
  }

  let checkQ =
    r.table('organizations')
      .get(organizationId)('users')
      .map((user) => {
        return user('id')
      })
      .contains(userId);
  let removeOrganizationQ =
    r.table('users')
      .get(userId)
      .update((user) => {
        return {
          organizations: user('organizations').default([]).filter((organization) => {
            return organization('id').ne(organizationId)
          })
        }
      });
  let removeUserQ =
    r.table('organizations')
      .get(organizationId)
      .update((organization) => {
        return {
          users: organization('users').default([]).filter((user) => {
            return user('id').ne(userId)
          })
        }
      });

  db.rethinkQuery(checkQ)
    .then((isUser) => {
      if (!isUser) {
        return res.status(200).json({
          ok: false,
          err: 'You are not part of that organization!'
        });
      }

      return db.rethinkQuery(r.do(removeOrganizationQ, removeUserQ));
    })
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((err) => {
      return next(err);
    })
})

module.exports = router;
