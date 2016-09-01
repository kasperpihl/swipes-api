import { bindAll, debounce } from './utils'
import { api } from '../actions'

export default class SwipesUrlProvider {
  constructor(store){
    bindAll(this, ['subscribe', 'unsubscribe', 'fetch', 'setThrottleThreshold'])
    this._listenersObj = {}
    this._shortUrlData = {}
    this.store = store;
    this.urlsToFetch = []
    this.fetchingUrls = null;
    this.setThrottleThreshold(30)
  }
  setThrottleThreshold(duration){
    this.throttleThreshold = duration;
    this.throttledFetch = debounce(this.fetch, duration);
  }
  fetch(shortUrl){
    if(typeof shortUrl === 'string'){
      this.urlsToFetch.push(shortUrl);
      return this.throttledFetch();
    }
    if(this.fetchingUrls){
      return; // Already fetching!
    }

    this.fetchingUrls = [ ...new Set(this.urlsToFetch) ];
    this.urlsToFetch = [];

    this.store.dispatch(api.request('share.getData', { shareIds: this.fetchingUrls })).then((res) => {
      console.log('ressy', res);
      this.fetchingUrls.forEach((url, i) => {
        this.save(url, res.links[i]);
      })
      this.fetchingUrls = null;
      if(this.urlsToFetch.length){
        this.throttledFetch();
      }
    });
  }
  get(url){
    return this._shortUrlData[url];
  }
  save(url, data){
    this._shortUrlData[url] = data;
    this.notify(url, data.meta);
  }
  notify(shortUrl, data){
    const currentListeners = this._listenersObj[shortUrl];
    if(currentListeners){
      currentListeners.forEach(( { listener }) => {
        listener(data);
      })
    }
  }

  subscribe(shortUrl, listener, ctx){
    if(!shortUrl || typeof shortUrl !== 'string'){
      return console.warn('SwipesUrlProvider: addListener param1 (shortUrl): not set or not string', shortUrl);
    }
    if(!listener || typeof listener !== 'function'){
      return console.warn("SwipesUrlProvider: addListener param2 (listener): not set or not function");
    }
    if(typeof ctx !== 'string'){
      ctx = '';
    }

    const currentListeners = this._listenersObj[shortUrl] || [];
    currentListeners.push({listener: listener, context: ctx});
    this._listenersObj[shortUrl] = currentListeners;
    const currentData = this.get(shortUrl);
    if(currentData){
      console.log('sending initial data', currentData);
      listener(currentData.meta);
    }
    else{
      this.fetch(shortUrl);
    }
  }
  unsubscribe(shortUrl, listener, ctx){
    if(!shortUrl && !listener && !ctx){
      return console.warn('SwipesUrlProvider: removeListener: no params provided');
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
