import { bindAll } from './utils'

export default class Subscriber {
  constructor(){
    bindAll(this, ['add', 'remove', 'notify'])
    this._listenersObj = {}
  }
  notify(id){
    const currentListeners = this._listenersObj[id];
    if(currentListeners){
      currentListeners.forEach(( { listener }) => {
        listener.apply(null, Array.prototype.slice.call(arguments, 1));
      })
    }
  }

  add(id, listener, ctx){
    if(!id || typeof id !== 'string'){
      return console.warn('Subscriber: add param1 (id): not set or not string', id);
    }
    if(!listener || typeof listener !== 'function'){
      return console.warn("Subscriber: add param2 (listener): not set or not function");
    }
    if(typeof ctx !== 'string'){
      ctx = '';
    }

    const currentListeners = this._listenersObj[id] || [];
    currentListeners.push({listener: listener, context: ctx});
    this._listenersObj[id] = currentListeners;
  }
  remove(id, listener, ctx){
    if(!id && !listener && !ctx){
      return console.warn('Subscriber: remove: no params provided');
    }
    if(id){
      this._removeListener(id, listener, ctx);
    }
    else{
      for(var key in this._listenersObj){
        this._removeListener(key, listener, ctx);
      }
    }
  }
  _removeListener(id, listener, ctx){

    const currentListeners = this._listenersObj[id];
    if(!currentListeners){
      return;
    }
    // If only event name is provided, remove all
    if(!listener && !ctx){
      return delete this._listenersObj[id];
    }

    const newListeners = [];
    for(var i = 0 ; i < currentListeners.length ; i++){
      const listener = currentListeners[i];
      if(listener.listener !== listener && listener.context !== ctx)
        newListeners.push(listener);
    }
    if(!newListeners.length){
      return delete this._listenersObj[id];
    }
    else if(newListeners.length && newListeners.length !== currentListeners.length){
      this._listenersObj[id] = newListeners;
    }
  }

}
