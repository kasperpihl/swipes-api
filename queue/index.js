import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import express from 'express';

const port = config.get('port');
const app = express();

app.use(cors({
  origin: config.get('cors'),
  methods: 'HEAD, GET, POST',
  allowedHeader: 'Content-Type, Accept, X-Requested-With, Session, Content-Length, X-Requested-With',
}));

app.use('/health', (req, res) => {
  return res.status(200).json({});
});

app.use('/process', bodyParser.json(), (req, res) => {
  console.log(req.body);
  return res.status(200).json({});
});

const server = http.createServer(app);

server.listen(port);
console.log('queue is online');
