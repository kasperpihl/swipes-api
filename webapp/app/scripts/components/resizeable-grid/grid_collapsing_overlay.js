var React = require('react');
import CollapseIcon from './images/collapse-icon.svg'
var CollapsingOverlay = React.createClass({
  render(){
    return (
      <div className="sw-collapsing-overlay">
        <CollapseIcon />
        Collapse Chat
      </div>
    )
  }
});

module.exports = CollapsingOverlay;
