import * as types from '../constants/ActionTypes'
import { request } from './api'
import { SlackIcon, EarthIcon } from '../components/icons'

export function loadModal(data, callback) {
  return { type: types.LOAD_MODAL, data, callback }
}
export function hideModal() {
  return { type: types.HIDE_MODAL }
}

export function loadTilesListModal(){
  return (dispatch, getState) => {
    console.log('dispatch');
    const now = new Date().getTime()
    var returned = false;
    dispatch(loadModal({"title": "Add a tile", loader: true}, () => {
      returned = true;
    }));
    return;
    const now2 = new Date().getTime()
    dispatch(request('workflows.list')).then((res) =>{
      const time = new Date().getTime() - now;
      const time2 = new Date().getTime() - now2;
      if(res.ok && !returned){
        const rows = res.data.map((row) => {
          if (row.name === 'Slack') {
            const SVG = SlackIcon
            return Object.assign({}, row, {imageUrl: SVG})
          } else if (row.name === 'Browser Card') {
            const SVG = EarthIcon
            return Object.assign({}, row, {imageUrl: SVG})
          } else {
            return Object.assign({}, row)
          }
        })
        dispatch(loadModal({"title": "Add a tile", "emptyText": "We're working on adding more tiles.", "items": rows }, (row) => {

          if(row){
            dispatch(request('users.addWorkflow', {manifest_id: row.manifest_id}));
          }

        }))
      }

    })
  }
}
