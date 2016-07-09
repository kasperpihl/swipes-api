import * as types from '../constants/ActionTypes'
import { request } from './apiActions'

export function loadModal(modal, options, callback) {
  return { type: types.LOAD_MODAL, modal, options, callback }
}
export function hideModal() {
  return { type: types.HIDE_MODAL }
}

export function loadTilesListModal(){
  return (dispatch, getState) => {
    console.log('dispatch');
    dispatch(request('workflows.list')).then((res) =>{  
      if(res.ok){
        dispatch(loadModal('list', {"title": "Add a workflow", "emptyText": "We're working on adding more workflows.", "rows": res.data }, (row) => {

          if(row){
            dispatch(request('users.addWorkflow', {manifest_id: row.manifest_id}));
          }
          
        }))
      }
      
    })
  }
}