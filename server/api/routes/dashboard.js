import express from 'express';
import r from 'rethinkdb';
import db from '../../db';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/dashboardd_awesome_cat_rainbow',
  (req, res, next) => {
    const sw = r.db('swipes');
    const promises = [
      sw.table('users').filter({ activated: true }).count(),
      sw.table('users').filter({ activated: false }).count(),
      sw.table('organizations').count(),
      sw.table('goals').count(),
      sw.table('milestones').count(),
    ].map(q => db.rethinkQuery(q));

    Promise.all(promises).then((results) => {
      res.json({
        users: results[0],
        pendingUsers: results[1],
        organizations: results[2],
        goals: results[3],
        milestones: results[4],
      });
    });
  },
 );

export {
  authed,
  notAuthed,
};
