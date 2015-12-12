var Reflux = require('reflux');
var Actions = require('../../actions/modals/SearchModalActions');

var realData = [
  {
    name: 'People',
    icon: 'person',
    list: [
      {title: 'Swipes', text: 'Kasper'},
      {title: 'Swipes', text: 'Stefan'},
      {title: 'Swipes', text: 'Stanimir'},
      {title: 'Swipes', text: 'Yana'} // Okaaay I will put a female name in the people's array // Haha
    ]
  },
  {
    name: 'Email',
    icon: 'email',
    list: [
      {title: 'This is fake', text: 'the title is misleading'},
      {title: 'Kasper!', text: '...nothing ha-ha'},
      {title: 'Reflux guru', text: 'Far from it...'}
    ]
  },
  {
    name: 'Messages',
    icon: 'message',
    list: [
      {title: 'general', text: 'why general?'},
      {title: 'general', text: 'because we have only general'},
      {title: 'general', text: 'fair enough'}
    ]
  },
  {
    name: 'Tetris',
    icon: 'view_headline',
    list: [
      {title: 'Kasper', text: '234829432942'},
      {title: 'Mitko', text: '234829432941'},
      {title: 'Tihomir', text: '-∞'} // he will get better!
    ]
  },
  {
    name: 'Notes',
    icon: 'view_headline',
    list: [
      {title: 'Tetris', text: 'Train every day!'},
      {title: 'Tetris', text: 'I will get better'},
      {title: 'Tetris', text: 'Kasper and Mitko are still only humans!'},
      {title: 'Tetris', text: 'Tetris is a lifestyle'}
    ]
  },
  {
    name: 'Actions',
    icon: 'fiber_manual_record',
    list: [
      {title: 'Swipes', text: 'I have no idea what am I doing'},
      {title: 'Swipes', text: 'I write about action in an action?!'},
      {title: 'Swipes', text: 'Find my first favourite action movie'}
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

    var category = {name: realData[i].name, icon: realData[i].icon,  list: []};

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
  defaults: {
    realResponse: realData
  },
  onLoad:function(options){
    console.log("loaded search store", options);
  },
  onSearch: function (value) {
    this.set("realResponse", realSearch(value));
  }
});

module.exports = SearchStore;
