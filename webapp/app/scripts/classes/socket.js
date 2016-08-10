import * as types from '../constants/ActionTypes'
import io from 'socket.io-client'

export default class Socket {
  constructor(store){
    this.store = store;
    _.bindAll(this, 'message', 'changeStatus', 'storeChange')
    store.subscribe(this.storeChange)
  }
  storeChange(){
    const state = this.store.getState();
    const url = state.main.socketUrl;

    if(!this.socket && url && state.main.status !== 'connecting'){
      this.changeStatus('connecting');
      
      this.socket = io.connect(url, {
        query: 'token=' + state.main.token,
        reconnectionDelay: 5000
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
    if(!msg.type)
      return;
    this.store.dispatch({type: msg.type, payload: msg});
  }
}