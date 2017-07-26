import Fuse from 'fuse.js';
import { Map } from 'immutable'
import {
  string,
  array,
  object,
  number,
  any,
} from 'valjs';

import * as constants from '../constants';
import { valAction } from '../classes/utils';

// ======================================================
// Auto Completing
// ======================================================
export const search = valAction('autoComplete.search', [
  string.require(),
  object.as({
    types: array.of(any.of('users').require()).require(),
    delegate: object.require(),
  }).require(),
], (string, options) => (d) =>
  d({ type: constants.AUTO_COMPLETE, payload: { string, options: Map(options) } }));

export const clear = () => {
  return { type: constants.AUTO_COMPLETE_CLEAR, payload: null };
}
