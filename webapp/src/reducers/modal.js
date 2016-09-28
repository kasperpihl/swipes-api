import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = fromJS({
  shown: false
})

export default function modal (state = initialState, action) {
  switch (action.type) {
    case types.LOAD_MODAL:{
      const data = fromJS(action.data || {});
      state.update((ns) => ns.set('shown', true).set('data', data).set('callback', action.callback || null))
    }
    case types.HIDE_MODAL:{
      return initialState;
    }
    default: 
      return state
  }
}