var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var realData = [
  {
    name: 'Email',
    list: [
      {title: 'This is fake', text: 'the title is misleading'},
      {title: 'Kasper!', text: '...nothing ha-ha'},
      {title: 'Reflux guru', text: 'Far from it...'}
    ]
  },
  {
    name: 'Chat',
    list: [
      {title: 'general', text: 'why general?'},
      {title: 'general', text: 'because we have only general'},
      {title: 'general', text: 'fair enough'}
    ]
  },
  {
    name: 'Tetris',
    list: [
      {title: 'Kasper', text: '234829432942'},
      {title: 'Mitko', text: '234829432941'},
      {title: 'Tihomir', text: '-∞'} // he will get better!
    ]
  }
]

var realSearch = function (value) {
  var realResponse = [];
  var len = realData.length;

  for (var i=0; i<len; i++) {
    if (realData[i].name.indexOf(value) !== -1) {
      realResponse.push(realData[i]);
      continue;
    }

    var category = {name: realData[i].name, list: []};

    realData[i].list.forEach(function (item) {
      if (item.title.indexOf(value) !== -1 || item.text.indexOf(value) !== -1) {
        category.list.push(item);
      }
    })

    if (category.list.length > 0) {
      realResponse.push(category);
    }
  }

  return realResponse;
}

var SearchStore = Reflux.createStore({
  listenables: [Actions],
	//sort: "name"
  onSearch: function (value) {
    console.log(realSearch(value));
  }
});

module.exports = SearchStore;
