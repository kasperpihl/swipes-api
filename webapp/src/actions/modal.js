import * as types from '../constants/ActionTypes'
import { request } from './api'

export function loadModal(modal, options, callback) {
  return { type: types.LOAD_MODAL, modal, options, callback }
}
export function hideModal() {
  return { type: types.HIDE_MODAL }
}

export function loadTilesListModal(){
  return (dispatch, getState) => {
    console.log('dispatch');
    const now = new Date().getTime()
    dispatch(loadModal('list', {"title": "Add a workflow", "emptyText": "Loading..."}));
    const now2 = new Date().getTime()
    dispatch(request('workflows.list')).then((res) =>{ 
      const time = new Date().getTime() - now;
      const time2 = new Date().getTime() - now2;
      console.log('returned', time, time2);
      if(res.ok){
        const rows = res.data.map((row) => {
          return Object.assign({}, row, {imageUrl: 'workflows/' + row.manifest_id + '/' + row.icon})
        })
        dispatch(loadModal('list', {"title": "Add a workflow", "emptyText": "We're working on adding more workflows.", "rows": rows }, (row) => {

          if(row){
            dispatch(request('users.addWorkflow', {manifest_id: row.manifest_id}));
          }
          
        }))
      }
      
    })
  }
}