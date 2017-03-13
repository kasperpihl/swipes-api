import * as types from 'constants';

// ======================================================
// Simple persistent cache
// ======================================================
export const save = (index, data) => ({ type: types.CACHE_SAVE, payload: { index, data } });

export const remove = index => ({ type: types.CACHE_REMOVE, payload: { index } });

export const clear = () => ({ type: types.CACHE_CLEAR });
