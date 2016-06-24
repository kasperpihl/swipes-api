var React = require('react');
var Topbar = React.createClass({
  render(){
    const {
      data
    } = this.props;


    var className = "sw-grid-topbar";
    
    return (
      <div className={className}>
        <div className="sw-grid-topbar_content">
          <div className="sw-grid-topbar_content-menu">
            <div className="menu-icon"></div>
          </div>
          <div className="sw-grid-topbar_content-title">Chat</div>
          <div className="sw-grid-topbar_content-seperator"></div>
          <div className="sw-grid-topbar_content-subtitle">Swipes Team</div>
        </div>
        <div className="sw-grid-topbar_actions">
          <div className="sw-grid-topbar_actions-collapse" onClick={this.props.delegate.onCollapse.bind(null, this.props.data.id)}>
            <div className="collapse-icon"></div>
          </div>
          <div className="sw-grid-topbar_actions-fullscreen" onClick={this.props.delegate.onFullscreen.bind(null, this.props.data.id)}>
            <div className="fullscreen-icon"></div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Topbar;