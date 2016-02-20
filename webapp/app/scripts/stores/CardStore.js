var Reflux = require('reflux');
var CardActions = require('../actions/CardActions');

var _cards = [];

var CardStore = Reflux.createStore({
	listenables: [ CardActions ],
  onAddCard: function (card) {
    _cards.push(card);
  },
  onBroadCast: function (message) {
    _cards.forEach(function (card) {
      card.apiCon.callListener('event', {type: message.command}, function (data) {
        console.log(data);
      });
    });
  }
});

module.exports = CardStore;
