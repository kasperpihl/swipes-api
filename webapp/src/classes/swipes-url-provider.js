import { bindAll, debounce } from './utils'
import { api } from '../actions'

export default class SwipesUrlProvider {
  constructor(store){
    bindAll(this, ['subscribe', 'unsubscribe', 'fetch', 'setThrottleThreshold'])
    this._listenersObj = {}
    this._shareUrlData = {}
    this.store = store;
    this.urlsToFetch = []
    this.fetchingUrls = null;
    this.setThrottleThreshold(30)
  }
  setThrottleThreshold(duration){
    this.throttleThreshold = duration;
    this.throttledFetch = debounce(this.fetch, duration);
  }
  fetch(shareUrl){
    if(typeof shareUrl === 'string'){
      this.urlsToFetch.push(shareUrl);
      return this.throttledFetch();
    }
    if(this.fetchingUrls){
      return; // Already fetching!
    }

    this.fetchingUrls = [ ...new Set(this.urlsToFetch) ];
    this.urlsToFetch = [];

    this.store.dispatch(api.request('share.getData', { shareIds: this.fetchingUrls })).then((res) => {
      this.fetchingUrls.forEach((url, i) => {
        this.save(url, res.links[i].service_data);
      })
      this.fetchingUrls = null;
      if(this.urlsToFetch.length){
        this.throttledFetch();
      }
    });
  }
  save(url, data){
    this._shareUrlData[url] = data;
    this.notify(url, data);
  }
  notify(shareUrl, data){
    const currentListeners = this._listenersObj[shareUrl];
    if(currentListeners){
      currentListeners.forEach(( { listener }) => {
        listener(data);
      })
    } 
  }

  subscribe(shareUrl, listener, ctx){
    if(!shareUrl || typeof shareUrl !== 'string'){
      return console.warn('ShareUrlProvider: addListener param1 (shareUrl): not set or not string', shareUrl);
    }
    if(!listener || typeof listener !== 'function'){
      return console.warn("ShareUrlProvider: addListener param2 (listener): not set or not function");
    }
    if(typeof ctx !== 'string'){
      ctx = '';
    }

    const currentListeners = this._listenersObj[shareUrl] || [];
    currentListeners.push({listener: listener, context: ctx});
    this._listenersObj[shareUrl] = currentListeners;
    const currentData = this._shareUrlData[shareUrl];
    if(currentData){
      console.log('sending initial data', currentData);
      listener(currentData);
    } 
    else{
      this.fetch(shareUrl);
    }
  }
  unsubscribe(shareUrl, listener, ctx){
    if(!shareUrl && !listener && !ctx){
      return console.warn('ShareUrlProvider: removeListener: no params provided');
    }
    if(shareUrl){
      this._removeListenersForShareUrl(shareUrl, listener, ctx);
    }
    else{
      for(var key in this._listenersObj){
        this._clearEventName(key, listener, context);
      }
    }
  }
  _removeListenersForShareUrl(shareUrl, listener, ctx){

    const currentListeners = this._listenersObj[shareUrl];
    if(!currentListeners){
      return;
    }
    // If only event name is provided, remove all
    if(!listener && !ctx){
      return delete this._listenersObj[shareUrl];
    }

    const newListeners = [];
    for(var i = 0 ; i < currentListeners.length ; i++){
      const listener = currentListeners[i];
      if(listener.listener !== listener && listener.context !== ctx)
        newListeners.push(listener);
    }
    if(!newListeners.length){
      return delete this._listenersObj[shareUrl];
    }
    else if(newListeners.length && newListeners.length !== currentListeners.length){
      this._listenersObj[shareUrl] = newListeners;
    }
  }

}