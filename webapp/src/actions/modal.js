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
    var returned = false;
    dispatch(loadModal({"title": "Add a tile", loader: true}, () => {
      returned = true;
    }));
    dispatch(request('workflows.list')).then((res) =>{
      if(res.ok && !returned){
        const rows = res.data.map((row) => {
          if (row.name === 'Slack') {
            const SVG = SlackIcon
            return Object.assign({}, row, {image: SVG})
          } else if (row.name === 'Browser Card') {
            const SVG = EarthIcon
            return Object.assign({}, row, {image: SVG})
          } else {
            return Object.assign({}, row)
          }
        })
        dispatch(loadModal({"title": "Add a tile", "emptyText": "We're working on adding more tiles.", "items": rows, loader: false }, (result) => {

          if(result){
            dispatch(request('users.addWorkflow', {manifest_id: res.data[result.item].manifest_id}));
          }

        }))
      }

    })
  }
}
