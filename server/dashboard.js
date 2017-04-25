import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
import r from 'rethinkdb';
import db from './db';

app.use(cors({
  origin: '*',
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Range, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
  exposedHeaders: 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
}));

const server = http.createServer(app);
app.all('/', (req, res, next) => {
  const sw = r.db('swipes');
  const promises = [
    sw.table('users').filter({ activated: true }).count(),
    sw.table('users').filter({ activated: false }).count(),
    sw.table('organizations').count(),
    sw.table('goals').count(),
    sw.table('milestones').count(),
  ].map((q) => db.rethinkQuery(q));

  Promise.all(promises).then((results) => {
    res.json({
      users: results[0],
      pendingUsers: results[1],
      organizations: results[2],
      goals: results[3],
      milestones: results[4],
    });
  });
});

// start api rest server
server.listen(1337);

console.log('server started on port %s', 1337);
