import * as types from '../constants';

export const update = (type, id, filter) => ({ type: types.FILTER_UPDATE, payload: { id, type, filter } });

export const clear = (type, id) => ({ type: types.FILTER_CLEAR, payload: { id, type } });
