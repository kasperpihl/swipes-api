var SwipesAPIConnector = (function () {
	function SwipesAPIConnector(baseUrl, token) {

		if (!baseUrl) {
			throw new Error('SwipesAPIConnector: No baseUrl set in constructor');
		}

		this._baseURL = baseUrl;
		this._apiUrl = baseUrl + '/v1/';
		this._token = token;
		this._apiQueue = [];

	};

	SwipesAPIConnector.prototype.setToken = function (token) {
		this._token = token;
		if (this._apiQueue.length > 0) {
			for (var i = 0; i < this._apiQueue.length; i++) {
				var request = this._apiQueue[i];

				this.callSwipesApi(request.options, request.data, request.callback, request.deferred);
			}

			this._apiQueue = [];
		}
	};
	SwipesAPIConnector.prototype.getToken = function () {
		return this._token;
	}
	SwipesAPIConnector.prototype.getBaseURL = function () {
		return this._baseURL;
	};

	SwipesAPIConnector.prototype.getAPIURL = function () {
		return this._apiUrl;
	};

	SwipesAPIConnector.prototype.request = function (options, data, callback, deferred) {
		if(!deferred && window.Q) {
			deferred = Q.defer();
		}

		var command, force;

		if(typeof options === 'string') {
			command = options;
		}

		if (typeof options === 'object') {
			command = options.command || null;
			force = options.force || false;
		}

		if (!this._token && !force) {
			this._apiQueue.push({options: options, data: data, callback: callback, deferred: deferred});

			return deferred.promise;
		}

		// If no data is send, but only a callback set those
		if (typeof data === 'function') {
			callback = data;
		}

		var url = this._apiUrl + command;

		if ((data == null) || typeof data !== 'object') {
			data = {};
		}

		data.token = this._token;

		var serData = JSON.stringify(data);
		var settings = {
			url: url,
			type: 'POST',
			success: function(data) {
				console.log('/' + command + ' success', data);
				if (data && data.ok) {
					if(typeof callback === 'function')
						callback(data);
					if(deferred) deferred.resolve(data);
				} else {
					if(typeof callback === 'function')
						callback(false, data);
					if(deferred) deferred.reject(data);
				}
			},
			error: function(error) {
				console.log('/' + command + ' error', error);
				if(error.responseJSON)
					error = error.responseJSON;
				if(typeof callback === 'function')
					callback(false, error);
				if(deferred) deferred.reject(error);
			},
			crossDomain: true,
			contentType: 'application/json; charset=utf-8',
			context: this,
			data: serData,
			processData: true
		};
		$.ajax(settings);
		return deferred ? deferred.promise : false;
	};

	SwipesAPIConnector.prototype.streamRequest = function (options, data, callback, deferred) {
		if(!deferred && window.Q) {
			deferred = Q.defer();
		}

		var command,
				force;

		if(typeof options === 'string') {
			command = options;
		}

		if (typeof options === 'object') {
			command = options.command || null;
			force = options.force || false;
		}

		// If no data is send, but only a callback set those
		if (typeof data === 'function') {
			callback = data;
		}

		var url = this._apiUrl + command;

		if ((data == null) || typeof data !== 'object') {
			data = {};
		}

		data.token = this._token;

		var serData = JSON.stringify(data);

		var xhr = new XMLHttpRequest();
		xhr.open('POST', url, true);
		xhr.responseType = 'arraybuffer';
		xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

		xhr.onload = function(e) {
			var data = e.currentTarget.response;

			if(typeof callback === 'function')
				callback(data);
			if(deferred) deferred.resolve(data);
		};

		xhr.onerror = function(e) {
			console.log('/' + command + ' error', error);
			if(error.responseJSON)
				error = error.responseJSON;
			if(typeof callback === 'function')
				callback(false, error);
			if(deferred) deferred.reject(error);
		};

		xhr.send(serData);
	};

	return SwipesAPIConnector;
})();
