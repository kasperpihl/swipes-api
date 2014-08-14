var request = require('request');

// Endpoints for Vero API calls
var BASE_URL = 'https://api.getvero.com/';

var ENDPOINTS = {
    ADD_USER: {
        method: 'post',
        url: BASE_URL + 'api/v2/users/track'
    },

    EDIT_USER: {
        method: 'put',
        url: BASE_URL + 'api/v2/users/edit'
    },

    EDIT_TAGS: {
        method: 'put',
        url: BASE_URL + 'api/v2/users/tags/edit'
    },

    UNSUBSCRIBE_USER: {
        method: 'post',
        url: BASE_URL + 'api/v2/users/unsubscribe'
    },

    ADD_EVENT: {
        method: 'post',
        url: BASE_URL + 'api/v2/events/track'
    }
}

var EventLogger = function (authToken, devMode) {
    this.authToken = authToken;
    this.devMode = devMode;
}

EventLogger.prototype.makeRequest = function (endpoint, payload, cb) {
    var requestOptions,
        req;

    requestOptions = {
        url: endpoint.url
    };

    payload.auth_token = this.authToken;
    payload.development_mode = this.devMode;

    req = request[endpoint.method](requestOptions, function (err, res, body) {
        if (err) return cb(err);

        cb(err, res, JSON.parse(body));
    });

    payload = JSON.stringify(payload);

    req.headers['Content-Length'] = payload.length;
    req.body = payload;
}

EventLogger.prototype.addUser = function (id, email, userData, cb) {
    var payload;

    if (typeof userData === 'function') {
        cb = userData;
        userData = undefined;
    }

    payload = {
        id: id,
        email: email,
        data: userData
    };

    this.makeRequest(ENDPOINTS.ADD_USER, payload, cb);
}

EventLogger.prototype.editUser = function (id, changes, cb) {
    var payload;

    payload = {
        id: id,
        changes: changes
    };

    this.makeRequest(ENDPOINTS.EDIT_USER, payload, cb);
}

EventLogger.prototype.addTags = function (id, tags, cb) {
    var payload;

    payload = {
        id: id,
        add: tags
    };

    this.makeRequest(ENDPOINTS.EDIT_TAGS, payload, cb);
}

EventLogger.prototype.removeTags = function (id, tags, cb) {
    var payload;

    payload = {
        id: id,
        remove: tags
    };

    this.makeRequest(ENDPOINTS.EDIT_TAGS, payload, cb);
}

EventLogger.prototype.unsubscribeUser = function (id, cb) {
    var payload;

    payload = {
        id: id,
    };

    this.makeRequest(ENDPOINTS.UNSUBSCRIBE_USER, payload, cb);
}

EventLogger.prototype.addEvent = function (identity, eventName, eventData, cb) {
    var payload;

    if (typeof eventData === 'function') {
        cb = eventData;
        eventData = undefined;
    }

    payload = {
        identity: identity,
        event_name: eventName,
        data: eventData
    };

    this.makeRequest(ENDPOINTS.ADD_EVENT, payload, cb);
}

// add class attrs
EventLogger.ENDPOINTS = ENDPOINTS;

exports.EventLogger = EventLogger;