'use strict';
var Reflux = require('reflux');
var _ = require('underscore');

Reflux.StoreMethods.idAttribute = "id";
Reflux.StoreMethods._checkForWarnings = function(){
  if(!this._didLoadData)
    throw new Error("Reflux Swipes: If you override init or getInitialState, please call this.manualLoadData()");
}
Reflux.StoreMethods.connect = function(property){
  return Reflux.connect(this, property);
};
Reflux.StoreMethods.connectFilter = function(property, filterFn){
  return Reflux.connectFilter(this, property, filterFn);
};

Reflux.StoreMethods.set = function(id, data, options){
  this._handleOptions(options);

  
  if(this.beforeSaveHandler && typeof this.beforeSaveHandler === 'function'){
    data = this.beforeSaveHandler(data, this.get(id));
    if(!data){
      if(this.get(id)){
        this.unset(id);
      }
      console.warn("Swipes Reflux: beforeHandler prevented the save");
      return;
    }
  }

  this._dataById[id] = data;

  // Save and trigger to all listeners
  this._saveDataAndTrigger(options);
  
};

Reflux.StoreMethods.update = function(id, data, options){
  this._handleOptions(options);

  var currentObj = this.get(id);
  if(!currentObj)
    return this.set(id, data, options);
  if(typeof currentObj !== 'object' || typeof data !== 'object')
    return console.warn("Reflux Swipes: update should only be used on objects.");

  var didUpdate = false;
  for(var key in data){
    var value = data[key];
    if(value !== currentObj[key]){
      currentObj[key] = value;
      didUpdate = true;
    }
  }
  if(didUpdate)
    this.set(id, currentObj, options);
};
Reflux.StoreMethods.unset = function(ids, options){
  if(options && typeof options === 'object'){
    options.persist = true;
    options.trigger = true;
  }
  this._handleOptions(options);
  if(!_.isArray(ids)){
    ids = [ids];
  }
  for(var i = 0 ; i < ids.length ; i++){
    var id = ids[i];
    delete this._dataById[id];
  }

  // Sort and trigger to all listeners
  this._saveDataAndTrigger(options);
  
};
Reflux.StoreMethods.getAll = function(){
  if(this.sort){
    return _.sortBy(this._dataById, this.sort);
  }
  return this._dataById;
};
Reflux.StoreMethods.get = function(id){
  if(id){
    return this._dataById[id];
  }
  return null;
  
};
Reflux.StoreMethods._reset = function(options){
  this._dataById = _.defaults({}, this.defaults);
  if(this.localStorage)
    localStorage.removeItem(this.localStorage);
  this._saveDataAndTrigger(options);
};

Reflux.StoreMethods._handleOptions = function(options){
  this._checkForWarnings();

  // Checking for options
  if(options && typeof options === 'object'){
    // Flush the whole store before setting, defaults to NO
    if(options.flush)
      this._reset();
  }
};

Reflux.StoreMethods._saveDataAndTrigger = function(options){
  
  var persist = true, trigger = true;

  // Checking for options
  if(options && typeof options === 'object'){
    if(typeof options.persist !== 'undefined')
      persist = options.persist;
    if(typeof options.trigger !== 'undefined')
      trigger = options.trigger;
  }
  
  
  // Persist to localStorage if localstorage key is set, defaults to YES
  if(persist && this.localStorage){
    var dataToPersist = this._dataById;
    if(this.persistOnly && this.persistOnly instanceof Array){
      dataToPersist = _.pick(dataToPersist, this.persistOnly);
    }
    else if(this.persistNot && this.persistNot instanceof Array){
      dataToPersist = _.omit(dataToPersist, this.persistNot);
    }
    
    localStorage.setItem(this.localStorage, JSON.stringify(dataToPersist));
  }
  if(trigger){
    this.manualTrigger();
  }

};

Reflux.StoreMethods.batchLoad = function(items, options){
  if(!this.idAttribute || typeof this.idAttribute !== 'string')
    return console.warn("Swipes Reflux: batchLoad requires idAttribute to be set on store [string]");

  if(!items || !(items instanceof Array))
    return console.warn("Swipes Reflux: batchLoad must have an array of items");

  
  this._handleOptions(options);

  for(var i = 0 ; i < items.length ; i++){
    var item = items[i];
    if(typeof item !== 'object'){
      console.warn("Swipes Reflux: batchLoad item wasn't object... Skipping:", item);
      continue;
    }

    var idAttribute = item[this.idAttribute];
    if(!idAttribute || typeof idAttribute !== 'string'){
      console.warn("Swipes Reflux: batchLoad item didn't have valid idAttribute... Skipping:", item);
      continue;
    }

    this.set(idAttribute, item, {trigger: false, persist: false });
    
  }
  
  // Save and trigger to all listeners
  this._saveDataAndTrigger(options);
}


Reflux.StoreMethods.init = function(){
  return this.manualLoadData();
};
Reflux.StoreMethods.getInitialState = function(){
  return this.manualLoadData();
};
Reflux.StoreMethods.manualLoadData = function(){
  if(!this._didLoadData)
    return this._loadData();
  else {
    var dataFromStorage = this._dataById;
    if(this.sort){
      dataFromStorage = _.sortBy(dataFromStorage, this.sort);
    }
    return dataFromStorage;
  }

};
Reflux.StoreMethods.manualTrigger = function(){
  

  var dataToTrigger = this._dataById;
  // Sort data before sending, can take both string and functions.
  if(this.sort){
    dataToTrigger = _.sortBy(dataToTrigger, this.sort);
  }

  this.trigger(dataToTrigger);
}


Reflux.StoreMethods._loadData = function(){
  this._didLoadData = true;

  var dataFromStorage = this._dataById;
  if(!dataFromStorage)
    dataFromStorage = {};

  if(this.localStorage && _.size(dataFromStorage) == 0){
    dataFromStorage = localStorage.getItem(this.localStorage);
    if(dataFromStorage)
      dataFromStorage = JSON.parse(dataFromStorage);
    else
      dataFromStorage = {};
  }
  this._dataById = _.defaults(dataFromStorage,  this.defaults);
  

  if(this.sort){
    dataFromStorage = _.sortBy(this._dataById, this.sort);
  }

  return dataFromStorage;
};



module.exports = Reflux;