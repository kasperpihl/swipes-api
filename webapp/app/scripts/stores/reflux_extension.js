var Reflux = require('reflux');

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
Reflux.StoreMethods.unset = function(id, options){
	this._handleOptions(options);
	
	if(this._dataById[id])
		this._dataById[id] = null;

	// Sort and trigger to all listeners
	this._saveDataAndTrigger(options);
};
Reflux.StoreMethods.get = function(id){

	if(id){
		return this._dataById[id];
	}
	if(this.sort){
		return this.sortBy(this.sort);
	}
	return this._dataById;
		// Sort data before sending, can take both string and functions.
	
	
};
Reflux.StoreMethods._reset = function(){
	this._dataById = _.defaults({}, this.defaults);
	if(this.localStorage)
		localStorage.removeItem(this.localStorage);
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
		// Check if any keys should be avoided
		if((this.persistOnly && this.persistOnly instanceof Array) || (this.persistNot && this.persistNot instanceof Array)){
			dataToPersist = {};
			for(var key in this._dataById){
				if(this.persistOnly && _.indexOf(this.persistOnly, key) !== -1)
					dataToPersist[key] = this._dataById[key];
				else if(this.persistNot && _.indexOf(this.persistNot, key) === -1)
					dataToPersist[key] = this._dataById[key];
			}
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
			dataFromStorage = this.sortBy(this.sort);
		}
		return dataFromStorage;
	}

};
Reflux.StoreMethods.manualTrigger = function(){
	

	var dataToTrigger = this._dataById;
	// Sort data before sending, can take both string and functions.
	if(this.sort){
		dataToTrigger = this.sortBy(this.sort);
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
		dataFromStorage = this.sortBy(this.sort);
	}

	return dataFromStorage;
};



// Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
var collectionMethods = { forEach: 3, each: 3, map: 3, collect: 3, reduce: 4,
	foldl: 4, inject: 4, reduceRight: 4, foldr: 4, find: 3, detect: 3, filter: 3,
	select: 3, reject: 3, every: 3, all: 3, some: 3, any: 3, include: 3, includes: 3,
	contains: 3, invoke: 0, max: 3, min: 3, toArray: 1, size: 1, first: 3,
	head: 3, take: 3, initial: 3, rest: 3, tail: 3, drop: 3, last: 3,
	without: 0, difference: 0, indexOf: 3, shuffle: 1, lastIndexOf: 3,
	isEmpty: 1, chain: 1, sample: 3, partition: 3, groupBy: 3, countBy: 3,
	sortBy: 3, indexBy: 3};

var addMethod = function(length, method, attribute) {
	switch (length) {
		case 1: return function() {
			return _[method](this[attribute]);
		};
		case 2: return function(value) {
			return _[method](this[attribute], value);
		};
		case 3: return function(iteratee, context) {
			return _[method](this[attribute], cb(iteratee, this), context);
		};
		case 4: return function(iteratee, defaultVal, context) {
			return _[method](this[attribute], cb(iteratee, this), defaultVal, context);
		};
		default: return function() {
			var args = slice.call(arguments);
			args.unshift(this[attribute]);
			return _[method].apply(_, args);
		};
	}
};
var addUnderscoreMethods = function(Class, methods, attribute) {
	_.each(methods, function(length, method) {
		if (_[method]) Class[method] = addMethod(length, method, attribute);
	});
};
// Support `collection.sortBy('attr')` and `collection.findWhere({id: 1})`.
var cb = function(iteratee, instance) {
	if (_.isFunction(iteratee)) return iteratee;
	if (_.isObject(iteratee)) return modelMatcher(iteratee);
	if (_.isString(iteratee)) return function(model) { return model[iteratee]; };
	return iteratee;
};
var modelMatcher = function(attrs) {
	var matcher = _.matches(attrs);
	return function(model) {
		return matcher(model);
	};
};

// Mix in each Underscore method as a proxy to `Collection#models`.
addUnderscoreMethods(Reflux.StoreMethods, collectionMethods, '_dataById');

module.exports = Reflux;