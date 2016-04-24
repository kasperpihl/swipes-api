var Reflux = require('reflux');
var cardActions = require('../actions/CardActions');
var eventActions = require('../actions/EventActions');

var CardStore = Reflux.createStore({
  listenables: [ cardActions ],
  _cards: [],
  onAdd: function (card) {
    var foundCard = this._cards.find(function (element) {
      return card.id === element.id;
    });

    if (foundCard === undefined) {
      this._cards.push(card);
    }
  },
  onBroadcast: function (event, data, callback) {
    var finalData = [];
    var count = this._cards.length-1;

    this._cards.forEach(function (card) {
      if (card.id !== data.sourceCardId) {
        eventActions.fire(event, {
          toCardId: card.id,
          callback: function (data) {
            // T_TODO make it in a way that if the developer didn't
            // put a handler on the other side
            // this callback would be called immediately with null as data
            //console.log('where are you');

            // T_TODO || K_TODO
            // Checking for dublication because if we reload only the card iframe
            // not the whole app, the card is subscribed to the main app as a new card
            // that is true for every event not only for share.init
            var dublicate = finalData.find(function (item) {
              return (item && item.id === card.id);
            })

            if (dublicate === undefined) {
              count--;

              if (data) {
                var url = card.index_url;
            		var splitURL = url.split('/').slice(0,-1).join('/');

                data.imageUrl = splitURL + '/' + card.icon;
                data.id = card.id;
                finalData.push(data);
              }

              if (count === 0) {
                callback(finalData);
              }
            }
          }
        })
      }
    })
  }
});

module.exports = CardStore;
