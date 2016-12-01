import express from 'express';
import {
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults,
} from './middlewares/xendo';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/search',
  xendoUserCredentials,
  xendoSearch,
  xendoSearchMapResults,
  (req, res) => {
    return res.status(200).json({ ok: true, result: res.locals.mappedResults });
  });

export {
  notAuthed,
  authed,
};
