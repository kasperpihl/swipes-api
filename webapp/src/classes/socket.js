import * as types from 'constants';
import { bindAll } from 'classes/utils';

export default class Socket {
  constructor(store) {
    this.store = store;
    this.reconnect_attempts = 1;
    bindAll(this, ['message', 'changeStatus', 'storeChange']);
    store.subscribe(this.storeChange);
  }
  storeChange() {
    const state = this.store.getState();

    const url = state.getIn(['main', 'socketUrl']);
    const token = state.getIn(['main', 'token']);

    if (!this.socket && url && state.getIn(['main', 'status']) !== 'connecting') {
      this.connect(url, token);
    }
  }
  connect(url, token) {
    const ws = new WebSocket(`${url}?token=${token}`);

    this.changeStatus('connecting');

    ws.onopen = () => {
      this.socket = true;
      this.changeStatus('online');
      // we can send stuff here like that
      // ws.send('stuff')
    };

    ws.onmessage = this.message;

    ws.onerror = (event) => {
      console.log('websocket error', event); // eslint-disable-line
    };

    ws.onclose = () => {
      this.changeStatus('offline');
      setTimeout(this.connect.bind(this, url, token), this.reconnect_attempts * 200);
      this.reconnect_attempts += 1;
    };
  }
  changeStatus(status) {
    this.store.dispatch({
      type: types.SET_STATUS,
      status,
    });
  }
  message(message) {
    const data = JSON.parse(message.data);
    const {
      type,
      payload,
    } = data;

    if (!type) {
      return;
    }
    this.store.dispatch({ type, payload });
    if (payload && payload.notification_data) {
      this.store.dispatch({
        type: types.NOTIFICATION_ADD,
        payload: payload.notification_data,
      });
    }
  }
}
