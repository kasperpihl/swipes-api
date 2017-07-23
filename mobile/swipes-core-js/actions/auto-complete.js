import Fuse from 'fuse.js';
import * as constants from '../constants';

import {
  string,
  array,
  object,
  number,
  any,
} from 'valjs';

import { valAction } from '../classes/utils';

// ======================================================
// Auto Completing
// ======================================================
export const search = valAction('autoComplete.search', [
  string.require(),
  array.of(any.of('users').require()).require(),
  object.as({
    top: number.require(),
    left: number.require(),
    width: number.require(),
    height: number.require(),
  }).require(),
  object.require(),
], (string, types, boundingRect, delegate) => (d) =>
  d({ type: constants.AUTO_COMPLETE, payload: { string, types, boundingRect, delegate } }));

export const clear = () => {
  return { type: constants.AUTO_COMPLETE_CLEAR, payload: null };
}
