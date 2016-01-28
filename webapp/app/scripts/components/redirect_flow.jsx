var Reflux = require('reflux');
var stateStore = require('../stores/StateStore');

module.exports = {
  toLogin: function (nextState, replace) {
    if (!stateStore.get("swipesToken")) {
      return replace('/signin');
    }
    // T_TODO: This causes trouble (stateStore get init twice!! Check home.jsx as well for second place)
    console.log('redirect to login and initing statestore');
    stateStore.actions.init();
  },
  toHome: function (nextState, replace) {
    if (stateStore.get("swipesToken")) {
      // T_TODO This stupid thing have a bug so I will use a stupid workaroud for now
      // and I will fire an issue on github
      //return replace('/');
      return window.location.assign("/");
    }
  }
};
