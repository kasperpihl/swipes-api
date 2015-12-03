var Reflux = require('reflux');

var data = [];

var AppLoaderStore = Reflux.createStore({

  init: function() {
    console.log('AppStore initialized');
    // This funciton will be called when the store will be first initialized
  }

});

module.exports = AppLoaderStore;
