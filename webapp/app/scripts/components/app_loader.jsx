var React = require('react');

var AppLoader = React.createClass({

  render: function() {
    return (
      <iframe src={this.props.data.app_src} className="app-frame-class" frameBorder="0"/>
    );
  }
});

module.exports = AppLoader;
