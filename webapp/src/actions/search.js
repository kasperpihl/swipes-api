import * as types from '../constants/ActionTypes'
import { request } from './api'

const mapResultToCard = (doc) => {
  
}

const search = (query) => {
  return (dispatch, getState) => {
    dispatch({type: types.SEARCH, query});
    dispatch(request('search', {q: query})).then((res) => {
      if(res && res.ok){
        dispatch({ type: types.SEARCH_RESULTS, result: res.result});
      }
      else{
        dispatch({ type: types.SEARCH_ERROR });
      }
    })
  }
}
export {
  search
}