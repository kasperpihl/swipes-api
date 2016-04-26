var React = require('react');
var moment = require('moment');

var LightboxModal = React.createClass({
  getInitialState: function() {
    return {
    }
  },
  render: function() {
    var options = this.props.data.options;
    console.log(options);

    var ww = window.innerWidth;
    var wh = window.innerHeight;

    return (
      <div className="lightbox" style={{width: ww, height: wh}}>
        <h2 className="image-title">{options.message}</h2>
        <img src={options.title}/>
      </div>
    )
  }
})

module.exports = LightboxModal;
