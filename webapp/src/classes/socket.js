import * as types from 'constants';
import { bindAll } from 'classes/utils';
import * as a from 'actions';

export default class Socket {
  constructor(store) {
    this.store = store;
    this.reconnect_attempts = 0;
    bindAll(this, ['message', 'changeStatus', 'storeChange']);
    store.subscribe(this.storeChange);
  }
  storeChange() {
    const state = this.store.getState();

    const token = state.getIn(['main', 'token']);
    if (token && !this.socket && state.getIn(['main', 'status']) !== 'connecting') {
      if (!this.timer) {
        this.timedConnect(token, this.timerForAttempt());
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
  timedConnect(token, time) {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.connect.bind(this, token), time);
  }
  connect(token) {
    let url = `${window.location.origin}`;

    if (window.location.hostname === 'localhost') {
      url = 'http://localhost:5000';
    }

    const wsUrl = `${url.replace(/http(s)?/, 'ws$1')}/ws`;
    const ws = new WebSocket(`${wsUrl}?token=${token}`);
    this.changeStatus('connecting');

    ws.onopen = () => {
      this.reconnect_attempts = 0;
      this.socket = true;
      this._pingTimer = setInterval(() => {
        this.sendPing(ws);
      }, 30000);
      this.store.dispatch(a.api.request('rtm.start')).then((res) => {
        if (res && res.ok) {
          this.changeStatus('online');
        } else {
          ws.close();
        }
      });
    };

    ws.onmessage = this.message;

    ws.onclose = () => {
      this.changeStatus('offline');
      clearInterval(this._pingTimer);
      this.reconnect_attempts += 1;
      const time = this.timerForAttempt();
      this.timedConnect(token, time);
    };
  }
  sendPing(ws) {
    if (this.status === 'online' && ws) {
      ws.send(JSON.stringify({ type: 'ping', id: 1 }));
    }
  }
  changeStatus(status) {
    this.status = status;
    this.store.dispatch({
      type: types.SET_STATUS,
      payload: { status },
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
    if (payload && payload.notification_data && Object.keys(payload.notification_data).length) {
      this.store.dispatch({
        type: types.NOTIFICATION_ADD,
        payload: payload.notification_data,
      });
    }
  }
}
