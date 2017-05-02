import http from 'http';
import express from 'express';
import cors from 'cors';
import request from 'request';

const app = express();

app.use(cors({
  origin: '*',
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Range, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
  exposedHeaders: 'Accept-Ranges, Content-Encoding, Content-Length, Content-Range',
}));

const server = http.createServer(app);
app.all('/', (req, res, next) => {
  const url = 'https://live.swipesapp.com/v1/dashboardd_awesome_cat_rainbow';
  const options = {
    method: 'get',
    json: true,
    url,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  };

  request(options, (err, res, body) => {
    if (err) {
      console.log(err);
      return next(err);
    }

    return res.json(res);
  });
});

// start api rest server
server.listen(1337);

console.log('server started on port %s', 1337);
