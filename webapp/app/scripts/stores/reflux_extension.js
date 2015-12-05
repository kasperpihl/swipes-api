var Reflux = require('reflux');

Reflux.StoreMethods._dataById = {};
Reflux.StoreMethods.idAttribute = "id";
Reflux.StoreMethods._sortedData = [];
Reflux.StoreMethods._didLoadData = false;
Reflux.StoreMethods._checkForWarnings = function(){
	if(this.localStorage && !this._didLoadData && this.getInitialState !== Reflux.StoreMethods.getInitialState)
		console.warn("Reflux Swipes: If you need to overwrite getInitialState, please call and return this.manualLoadData()");
	
}
Reflux.StoreMethods.connect = function(property){
	return Reflux.connect(this, property);
};
Reflux.StoreMethods.connectFilter = function(property, filterFn){
	return Reflux.connectFilter(this, property, filterFn);
};

Reflux.StoreMethods.get = function(id){
	this._checkForWarnings();

	return this._dataById[id];
};
Reflux.StoreMethods._reset = function(){
	this._dataById = {};
	if(this.localStorage)
		localStorage.removeItem(this.localStorage);
};
Reflux.StoreMethods._saveDataAndTrigger = function(options){
	
	var persist = true, trigger = true, sort = true;

	// Checking for options
	if(options && typeof options === 'object'){
		if(typeof options.persist !== 'undefined')
			persist = options.persist;
		if(typeof options.trigger !== 'undefined')
			trigger = options.trigger;
		if(typeof options.sort !== 'undefined')
			sort = options.sort;
	}

	var dataToTrigger = this._dataById;
	
	// Persist to localStorage if key is set, defaults to YES
	if(persist && this.localStorage){
		var dataToPersist = this._dataById;
		if((this.persistOnly && this.persistOnly instanceof Array) || (this.dontPersist && this.dontPersist instanceof Array)){
			dataToPersist = {};
			for(var key in this._dataById){
				if(this.persistOnly && _.indexOf(this.persistOnly, key) !== -1)
					dataToPersist[key] = this._dataById[key];
				else if(this.dontPersist && _.indexOf(this.dontPersist, key) === -1)
					dataToPersist[key] = this._dataById[key];
			}
		}
		
		localStorage.setItem(this.localStorage, JSON.stringify(dataToPersist));
	}

	// Sort data before sending, can take both string and functions.
	if(sort && this.sort){
		dataToTrigger = this.sortBy(this.sort);
	}

	if(trigger){
		this.trigger(dataToTrigger);
	}

};
Reflux.StoreMethods.batchLoad = function(items, options){
	this._checkForWarnings();
	
	if(!this.idAttribute || typeof this.idAttribute !== 'string')
		return console.warn("Swipes Reflux: batchLoad requires idAttribute to be set on store [string]");

	if(!items || !(items instanceof Array))
		return console.warn("Swipes Reflux: batchLoad must have an array of items");

	
	// Checking for options
	if(options && typeof options === 'object'){
		// Flush the whole store before setting, defaults to NO
		if(options.flush)
			this._reset();
	}


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

		this.set(idAttribute, item, {trigger: false, persist: false, sort: false});
		
	}
	
	// Save and trigger to all listeners
	this._saveDataAndTrigger(options);
}
Reflux.StoreMethods.set = function(id, data, options){
	this._checkForWarnings();

	// Checking for options
	if(options && typeof options === 'object'){
		// Flush the whole store before setting, defaults to NO
		if(options.flush)
			this._reset();
	}


	this._dataById[id] = data;

	// Sort and trigger to all listeners
	this._saveDataAndTrigger(options);
	
};

Reflux.StoreMethods.getInitialState = function(){
	return this._loadData();
};
Reflux.StoreMethods.manualLoadData = function(){
	return this._loadData();
};

Reflux.StoreMethods._loadData = function(){
	this._didLoadData = true;
	var dataFromStorage = this._dataById;
	if(this.localStorage && _.size(dataFromStorage) == 0){
		dataFromStorage = localStorage.getItem(this.localStorage);
		if(dataFromStorage)
			dataFromStorage = JSON.parse(dataFromStorage);
		else
			dataFromStorage = {};
	}

	// Check for defaults, and only set them if no data was present on their place
	if(this.defaults && typeof this.defaults === "object"){
		for(var key in this.defaults){
			if(this.defaults.hasOwnProperty(key) && typeof dataFromStorage[key] === 'undefined')
				dataFromStorage[key] = this.defaults[key];
		}
	}
	this._dataById = dataFromStorage;
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