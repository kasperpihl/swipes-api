var React = require('react');
var CollapsingOverlay = React.createClass({
  render(){
    return (
      <div className="sw-collapsing-overlay">
        <img src="styles/img/collapse-icon.svg" alt=""/>
        Collapse Chat
      </div>
    )
  }
});

module.exports = CollapsingOverlay;
