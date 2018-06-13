import * as types from '../constants';
import { fromJS } from 'immutable'
const initialState = fromJS({});

export default function(state = initialState, action) {
  const {
    type,
    payload
  } = action;
  switch (type) {
    default:
      return state
  }
}