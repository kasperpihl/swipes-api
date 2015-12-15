var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var SearchStore = Reflux.createStore({
  listenables: [Actions],
  defaults: {
    realResponse: []
  },
  prevValue: null,
  timer: null,
  onSearch: function (value) {
    var that = this;

    if (value.length === 0 || value === that.prevValue) {
      return;
    }

    window.clearTimeout(that.timer);
    that.set("realResponse", []);
    that.prevValue = value;

    that.timer = window.setTimeout(() => {
      swipes._client.callSwipesApi("search", {text: value}, function (res, error) {
        if (res.ok === true) {
          var results = res.results.filter(function (result) {
            if (result.results.length > 0) {
              return result;
            }
          })

          if (results.length > 0) {
            that.set("realResponse", results);
          }
        } else {
          console.log('Search error ' + res.err);
        }

        if (error) {
          console.log(error);
        }
      });
    }, 500);
  }
});

module.exports = SearchStore;
