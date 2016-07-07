var Reflux = require('reflux');
var stateStore = require('../stores/StateStore');

module.exports = {
  toSignUp: function (nextState, replace) {
    if (!stateStore.get("swipesToken")) {
      return replace('/signup');
    }

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
