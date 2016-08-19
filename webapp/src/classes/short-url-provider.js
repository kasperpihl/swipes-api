import { bindAll } from './utils'
import { api } from '../actions'

export default class ShortUrlProvider {
  constructor(store){
    bindAll(this, ['subscribe', 'unsubscribe', 'fetch'])
    this._listenersObj = {}
    this._shortUrlData = {}
    this.store = store;
  }
  fetch(shortUrl){
    this.store.dispatch(request('share.getData', { short_url: shortUrl })).then((res) => {
      console.log('res from data');
    });
  }
  subscribe(shortUrl, listener, ctx){
    if(!shortUrl || typeof shortUrl !== 'string'){
      return console.warn('ShortUrlProvider: addListener param1 (shortUrl): not set or not string');
    }
    if(!listener || typeof listener !== 'function'){
      return console.warn("ShortUrlProvider: addListener param2 (listener): not set or not function");
    }
    if(typeof ctx !== 'string'){
      ctx = '';
    }

    const currentListeners = this._listenersObj[shortUrl] || [];
    currentListeners.push({listener: listener, context: ctx});
    this._listenersObj[shortUrl] = currentListeners;
  }
  unsubscribe(shortUrl, listener, ctx){
    if(!shortUrl && !listener && !ctx){
      return console.warn('ShortUrlProvider: removeListener: no params provided');
    }
    if(shortUrl){
      this._removeListenersForShortUrl(shortUrl, listener, ctx);
    }
    else{
      for(var key in this._listenersObj){
        this._clearEventName(key, listener, context);
      }
    }
  }
  _removeListenersForShortUrl(shortUrl, listener, ctx){
    const currentListeners = this._listenersObj[shortUrl];
    if(!currentListeners){
      return;
    }
    // If only event name is provided, remove all
    if(!listener && !ctx){
      return delete this._listenersObj[shortUrl];
    }

    const newListeners = [];
    for(var i = 0 ; i < currentListeners.length ; i++){
      const listener = currentListeners[i];
      if(listener.listener !== listener && listener.context !== ctx)
        newListeners.push(listener);
    }
    if(!newListeners.length){
      return delete this._listenersObj[shortUrl];
    }
    else if(newListeners.length && newListeners.length !== currentListeners.length){
      this._listenersObj[shortUrl] = newListeners;
    }
  }

}