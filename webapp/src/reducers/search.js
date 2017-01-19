import { fromJS, List } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  query: null,
  searching: false,
  searchResults: List(),
});

const searchResults = results => results.map((doc) => {
  const shareData = { service: {}, meta: { service: doc.source }, permission: { type: 'public' } };
  const { meta } = shareData;
  const idParts = doc.id.split('-');
  shareData.service.name = doc.source;
  shareData.service.type = doc.content_type;
  shareData.permission.account_id = doc.account_id;
  if (doc.source === 'slack') {
    shareData.service.id = idParts[idParts.length - 1];

    if (['image', 'file', 'document'].indexOf(doc.content_type) > -1) {
      meta.title = doc.filename;
      meta.subtitle = `From ${doc.author}`;
    }
    if (doc.content_type === 'message') {
      meta.title = doc.message;
      meta.subtitle = doc.folder.join(', ');
      meta.subtitle += ` - ${doc.author}`;
    }
  } else if (doc.source === 'asana') {
    if (doc.content_type === 'task') {
      shareData.service.id = idParts[idParts.length - 1];
      meta.title = doc.title;
      if (doc.folder) {
        meta.subtitle = doc.folder.join(', ');
      } else {
        meta.subtitle = doc.status;
      }
      if (doc.to) {
        meta.subtitle += `: ${doc.to.join(', ')}`;
      }
    }
  } else if (doc.source === 'dropbox') {
    shareData.service.id = `rev:${idParts[idParts.length - 1]}`;
    meta.title = doc.filename;
    meta.subtitle = doc.filepath || '/';
  }
  // if (!meta.title) {}

  return { shareData, doc };
});

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case types.SEARCH: {
      return state.withMutations((ns) => {
        ns.set('searching', true);
        ns.set('searchResults', initialState.get('searchResults'));
        ns.set('query', action.query);
      });
    }
    case types.SEARCH_RESULTS: {
      return state.withMutations((ns) => {
        ns.set('searching', false);
        ns.set('searchResults', fromJS(searchResults(action.result)));
      });
    }
    case types.SEARCH_ERROR: {
      return state.set('searching', false);
    }
    case types.SEARCH_CLEAR:
    case types.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
