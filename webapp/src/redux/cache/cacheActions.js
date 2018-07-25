import * as types from '../constants';

export const getSelector = (selector, props) => (d, getState) => {
  return selector(getState(), props);
}

export const save = (path, data) => ({ 
  type: types.CACHE_SAVE,
  payload: { 
    path,
    data,
  }
});

export const clear = (path) => ({
  type: types.CACHE_CLEAR,
  payload: {
    path,
  }
});