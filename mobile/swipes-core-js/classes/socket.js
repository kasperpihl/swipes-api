import { fromJS } from 'immutable';
import { setupDelegate } from 'react-delegate';
import * as types from '../constants';

import { bindAll } from './utils';
import * as a from '../actions';

export default class Socket {
  constructor(store, delegate) {
    this.store = store;
    this.delegate = delegate;
    setupDelegate(this, 'forceLogout');
    this.reconnect_attempts = 0;
    bindAll(this, ['message', 'changeStatus', 'storeChange', 'onCloseHandler']);
    store.subscribe(this.storeChange);
  }
  storeChange() {
    const state = this.store.getState();
    this.token = state.getIn(['connection', 'token']);

    const forceFullFetch = state.getIn(['connection', 'forceFullFetch']);

    if (this.isConnected && (!this.token || forceFullFetch)) {
      this.forceClose(!this.token);
    }
    if (this.token && !this.isConnecting && !this.isConnected && !this.hasTimer) {
      this.timedConnect(this.timerForAttempt());
    }
  }
  forceClose(killSocket) {
    if(this.ws && killSocket) {
      this.ws.close();
    } else {
      this.onCloseHandler();
    }
  }
  onCloseHandler() {
    this.isConnecting = false;
    this.isConnected = false;
    this.reconnect_attempts += 1;
    this.changeStatus('offline', nextRetry);
    let nextRetry;
    if (this.token) {
      const time = this.timerForAttempt();
      this.timedConnect(time, true);
      nextRetry = new Date();
      nextRetry.setSeconds(nextRetry.getSeconds() + (time / 1000));
    } else {
      this.reconnect_attempts = 0;
      this.timer = undefined;
    }
  }
  timedConnect(time) {
    if(this.isConnecting) { 
      return;
    }
    clearTimeout(this.timer);
    this.timer = setTimeout(this.connect.bind(this), time);
    this.hasTimer = true;
  }
  connect() {
    const { getState } = this.store;
    let url = getState().getIn(['globals', 'apiUrl']);
    
    if (!url) {
      console.warn('Socket requires globals reducer to have apiUrl to be set');
      return;
    }

    if (url.includes('localhost')) {
      url = 'http://localhost:5000';
    }
    if (this.isConnecting) {
      return;
    }
    this.hasTimer = false;
    this.isConnecting = true;
    this.changeStatus('connecting');

    this.openSocket(url);
    
  }
  openSocket(url) {
    if(!window.WebSocket || this.isSocketConnected) {
      return this.fetchInit();
    }

    let wsUrl = `${url.replace(/http(s)?/, 'ws$1')}/ws`;
    wsUrl = `${wsUrl}?token=${this.token}`;

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isSocketConnected = true;
      this._pingTimer = setInterval(() => {
        this.sendPing();
      }, 5000);
      this.fetchInit();
    }

    this.ws.onmessage = this.message;

    this.ws.onclose = () => {
      this.isSocketConnected = false;
      clearInterval(this._pingTimer);
      this.onCloseHandler();
    }
  }
  fetchInit() {
    const { getState } = this.store;
    const forceFullFetch = getState().getIn(['connection', 'forceFullFetch']);
    const withoutNotes = getState().getIn(['globals', 'withoutNotes']);

    let timestamp;
    
    if(!forceFullFetch) {
      timestamp = getState().getIn(['connection', 'lastConnect']);
    }
    this.store.dispatch(a.api.request('init', {
      timestamp: timestamp || null,
      without_notes: withoutNotes,
    })).then((res) => {
      this.isConnecting = false;
      this.isConnected = true;
      if (res && res.ok) {
        this.reconnect_attempts = 0;
        this.changeStatus('online');
      } else if (res && res.error) {
        if (res.error.message === 'not_authed') {
          this.forceLogout();
        } else {
          this.forceClose();
        }
      }
    });
  }
  
  changeStatus(status, nextRetry) {
    this.status = status;
    this.store.dispatch({
      type: types.SET_CONNECTION_STATUS,
      payload: {
        status,
        reconnectAttempt: this.reconnect_attempts,
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

    if (!type || (this.isConnecting && type !== 'pong')) {
      return;
    }
    if(type === 'token_revoked') {
      const currToken = this.store.getState().getIn(['connection', 'token']);
      if (payload.token_to_revoke === currToken) {
        this.store.disatch({ type: types.RESET_STATE });
      }
    }
    const socketData = Object.assign({ ok: true }, payload && payload.data);
    this.store.dispatch({ type, payload: socketData });

    this.handleNotifications(payload);
  }
  handleNotifications(payload) {
    if (payload && payload.notification_data && Object.keys(payload.notification_data).length) {
      this.store.dispatch({
        type: types.NOTIFICATION_ADD,
        payload: payload.notification_data,
      });

      if (window && window.ipcListener && window.msgGen) {
        const n = fromJS(payload.notification_data);
        const nToSend = window.msgGen.notifications.getDesktopNotification(n);
        if(nToSend) {
          window.ipcListener.sendNotification(nToSend);
        }
      }
    }
  }
  sendPing() {
    if (this.ws && this.ws.readyState == this.ws.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'ping',
        id: 1,
      }));
    }
  }
  timerForAttempt() {
    const maintenance = this.store.getState().getIn(['connection', 'versionInfo', 'maintenance']);
    if(maintenance) return 180000;
    switch (this.reconnect_attempts) {
      case 0: return 0;
      case 1:
      case 2:
      case 3: return 500;
      case 4: return 1000;
      case 5: return 5000;
      case 6: return 10000;
      case 7: return 30000;
      default: return 180000;
    }
  }
}
