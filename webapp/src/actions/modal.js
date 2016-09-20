import * as types from '../constants/ActionTypes'
import { request } from './api'
import { SlackIcon, EarthIcon } from '../components/icons'

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
    var returned = false;
    dispatch(loadModal('list', {"title": "Add a tile", "emptyText": "Loading..."}, () => {
      returned = true;
    }));
    const now2 = new Date().getTime()
    dispatch(request('workflows.list')).then((res) =>{
      const time = new Date().getTime() - now;
      const time2 = new Date().getTime() - now2;
      console.log('res', res);
      console.log('returned', returned, time, time2);
      if(res.ok && !returned){
        const rows = res.data.map((row) => {
          console.log(row.name);
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
        dispatch(loadModal('list', {"title": "Add a tile", "emptyText": "We're working on adding more tiles.", "rows": rows }, (row) => {

          if(row){
            dispatch(request('users.addWorkflow', {manifest_id: row.manifest_id}));
          }

        }))
      }

    })
  }
}
