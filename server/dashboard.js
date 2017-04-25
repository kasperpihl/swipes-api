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
  const q =
    r.db('swipes')
      .table('users')
      .filter({ activated: true })
      .count();

  db.rethinkQuery(q).then((result) => {
    res.json({
      ok: true,
      result,
    });
  });
});

// start api rest server
server.listen(1337);

console.log('server started on port %s', 1337);
