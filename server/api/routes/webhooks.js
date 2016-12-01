import express from 'express';
import {
  dropbox,
  asana,
} from './middlewares/webhooks';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.get('/dropbox', (req, res) => {
  return res.status(200).send(req.query.challenge);
});

notAuthed.post('/dropbox',
  dropbox.validate,
  dropbox.process,
  (req, res) => {
    return res.status(200).send();
  });

notAuthed.post('/asana/*',
  asana.init,
  asana.validate,
  asana.process,
  (req, res) => {
    return res.status(200).send();
  });

export {
  authed,
  notAuthed,
};
