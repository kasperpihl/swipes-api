import * as types from '../constants/ActionTypes'
import io from 'socket.io-client'
import { bindAll } from './utils'

export default class Socket {
  constructor(store){
    this.store = store;
    bindAll(this, ['message', 'changeStatus', 'storeChange'])
    store.subscribe(this.storeChange)
  }
  storeChange(){
    const state = this.store.getState();
    const url = state.getIn(['main', 'socketUrl']);

    if(!this.socket && url && state.getIn(['main', 'status']) !== 'connecting'){
      this.changeStatus('connecting');

      this.socket = io.connect(url, {
        query: 'token=' + state.getIn(['main', 'token']),
        reconnectionDelay: 5000,
        'reconnection': true,
        'reconnectionDelayMax': 5000,
        'forceNew': true
      });
      this.socket.on('message', this.message)
      this.socket.on('connect', () => this.changeStatus('online'))
      this.socket.on('connect_error', () => this.changeStatus('offline'))
      this.socket.on('reconnect_attempt', () => this.changeStatus('connecting'));
      this.socket.on('disconnect', () => this.changeStatus('offline'));
    }
  }
  changeStatus(status){
    this.store.dispatch({
      type: types.SET_STATUS,
      status
    })
  }
  message(msg){
    console.log('msg', msg);
    if(!msg.type)
      return;
    this.store.dispatch({type: msg.type, payload: msg});
  }
}
