import Fuse from 'fuse.js';
import * as types from '../constants';
import * as cs from '../selectors';

const findResults = (string, options, getState) => {
  let defs = {
    types: ['milestones', 'goals', 'users'],
  };
  defs = Object.assign(defs, options);
  const results = [];
  const state = this.store.getState();
  if(def.types.indexOf('users') > -1) {
    get('users').forEach((g) => {
    })
  }
}
