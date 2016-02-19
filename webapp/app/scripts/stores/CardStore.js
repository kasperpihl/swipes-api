var Reflux = require('reflux');
var CardActions = require('../actions/CardActions');

var _cards = [];

var CardStore = Reflux.createStore({
	listenables: [ CardActions ],
  onAddCard: function (card) {
    _cards.push(card);
  },
  onBroadCast: function (message) {
    console.log(_cards);
    console.log(message);
    _cards.forEach(function (card) {
      card.apiCon.callListener('event', {type: message.command}, function (data) {
        console.log(data);
      });

      // var e = {
  		// 	type: 'share.request'
  		// };
  		// this.apiCon.callListener("event", e, function(actions){
  		// 	callback(actions);
  		// });
    });
  }
});

module.exports = CardStore;
