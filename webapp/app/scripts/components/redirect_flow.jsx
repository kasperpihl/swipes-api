var Reflux = require('reflux');
var stateStore = require('../stores/StateStore');

module.exports = {
  toLogin: function (nextState, replace) {
    if (!stateStore.get("swipesToken")) {
      return replace('/signin');
    }

    stateStore.actions.init();
  },
  toHome: function (nextState, replace) {
    if (stateStore.get("swipesToken")) {
      // T_TODO This stupid thing have a bug so I will use a stupid workaroud for now
      // and I will fire an issue on github
      //return replace('/');
      window.location.assign("/");
    }
  }
};
