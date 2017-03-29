import * as types from '../constants/ActionTypes';

import { bindAll } from './utils';
import * as a from '../actions';

export default class Socket {
  constructor(store) {
    this.store = store;
    this.reconnect_attempts = 0;
    bindAll(this, ['message', 'changeStatus', 'storeChange']);
    store.subscribe(this.storeChange);
  }
  storeChange() {
    const state = this.store.getState();

    this.token = state.getIn(['connection', 'token']);
    if (this.token && !this.socket && !this.isConnecting) {
      if (!this.timer) {
        this.timedConnect(this.timerForAttempt());
      }
    }
  }
  timerForAttempt() {
    switch (this.reconnect_attempts) {
      case 0: return 0;
      case 1: return 1000;
      case 2: return 5000;
      case 3: return 10000;
      case 4: return 30000;
      default: return 180000;
    }
  }
  timedConnect(time) {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.connect.bind(this), time);
  }
  connect() {
    let url = window.__API_URL__;
    if(!url){
      console.warn('Socket requires window.__API_URL__ to be set');
      return;
    }

    if (url.includes('localhost')) {
      url = 'http://localhost:5000';
    }
    if (this.isConnecting) {
      return;
    }
    this.isConnecting = true;

    const wsUrl = `${url.replace(/http(s)?/, 'ws$1')}/ws`;

    const ws = new WebSocket(`${wsUrl}?token=${this.token}`);
    this.changeStatus('connecting');
    ws.onopen = () => {
      this.socket = true;
      this._pingTimer = setInterval(() => {
        this.sendPing(ws);
      }, 30000);
      this.store.dispatch(a.api.request('rtm.start')).then((res) => {

        this.isConnecting = false;
        if (res && res.ok) {
          this.reconnect_attempts = 0;
          this.changeStatus('online');
        } else if (res && res.err !== 'not_authed') {
          ws.close();
        }
      });
    };

    ws.onmessage = this.message;

    ws.onclose = () => {
      this.isConnecting = false;
      clearInterval(this._pingTimer);
      this.reconnect_attempts += 1;
      const time = this.timerForAttempt();
      const nextRetry = new Date();
      nextRetry.setSeconds(nextRetry.getSeconds() + (time / 1000));
      this.changeStatus('offline', nextRetry);
      this.timedConnect(time);
    };
  }
  sendPing(ws) {
    if (this.status === 'online' && ws) {
      ws.send(JSON.stringify({ type: 'ping', id: 1 }));
    }
  }
  changeStatus(status, nextRetry) {
    this.status = status;
    this.store.dispatch({
      type: types.SET_STATUS,
      payload: {
        status,
        nextRetry,
      },
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
    const socketData = Object.assign({ ok: true }, payload && payload.data);
    this.store.dispatch({ type, payload: socketData });
    if (payload && payload.notification_data && Object.keys(payload.notification_data).length) {
      this.store.dispatch({
        type: types.NOTIFICATION_ADD,
        payload: payload.notification_data,
      });
    }
  }
}
