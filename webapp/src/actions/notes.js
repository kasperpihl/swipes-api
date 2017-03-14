import * as a from 'actions';
import * as types from 'constants';
import {
  EditorState,
  convertToRaw,
} from 'draft-js';

// ======================================================
// Notes
// ======================================================
const getServerOrg = (id, getState, include) => {
  const state = getState();
  const serverOrg = state.getIn(['notes', 'cache', id, 'serverOrg']);
  if (serverOrg) {
    return include ? serverOrg : undefined;
  }
  return state.getIn(['notes', 'server', id]);
};

export const create = (text, oId) => (dp, getState) => dp(a.api.request('notes.create', {
  organization_id: oId || getState().getIn(['me', 'organizations', 0, 'id']),
  text: text || convertToRaw(EditorState.createEmpty().getCurrentContent()),
}));

export const cache = (id, text) => (dp, getState) => {
  const serverOrg = getServerOrg(id, getState);
  dp({ type: types.NOTE_CACHE, payload: { id, text, serverOrg } });
};

export const save = (id, oId, text, saveId, rev) => (dp, getState) => new Promise((resolve) => {
  const serverOrg = getServerOrg(id, getState, true);

  dp({ type: types.NOTE_SAVE_START, payload: { id, text, saveId } });

  dp(a.api.request('notes.save', {
    organization_id: oId,
    id,
    save_id: saveId,
    text,
    rev: rev || serverOrg.get('rev') || 1,
  })).then((res) => {
    if (res && res.ok) {
      dp({ type: types.NOTE_SAVE_SUCCESS, payload: { id, note: res.note } });
    } else {
      dp({ type: types.NOTE_SAVE_ERROR, payload: { id, error: res.error } });
    }

    resolve(res);
  });
});
