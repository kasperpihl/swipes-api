import express from 'express';
import {
  valResponseAndSend,
} from '../utils';
import {
  planCSVExporter,
} from './middlewares/csv_exporter';

const authed = express.Router();
const notAuthed = express.Router();

authed.post(
  '/csvexporter.plans',
  planCSVExporter,
  valResponseAndSend(),
);

export {
  authed,
  notAuthed,
};
