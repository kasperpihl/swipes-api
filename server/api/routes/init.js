import express from 'express';
import initGetData from './middlewares/init';
import {
  sendResponse,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

// !T_TODO Change rtm.start to init before shipping the new server
authed.all('/rtm.start',
  initGetData,
  sendResponse,
);

export {
  notAuthed,
  authed,
};
