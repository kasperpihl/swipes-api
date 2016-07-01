var React = require('react');
var Topbar = React.createClass({
  onClick(e) {
    if (this.props.data.collapsed) {
      this.props.delegate.onExpand(this.props.data.id);
    }
  },
  render() {
    const {
      data
    } = this.props;
    let className = "sw-grid-topbar";
    let onclickHandler;
    let title = 'Chat';


    if (this.props.data.collapsed) {
      onclickHandler = this.onClick;

      return (
        <div className={className} onClick={onclickHandler}>
          <div className="sw-grid-topbar_content">
            <div className="sw-grid-topbar_content-title">
              <div className="collapsed__title--letter">C</div>
              <div className="collapsed__title--letter">H</div>
              <div className="collapsed__title--letter">A</div>
              <div className="collapsed__title--letter">T</div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className={className} onClick={onclickHandler}>
          <div className="sw-grid-topbar_content">
            <div className="sw-grid-topbar_content-menu" onClick={this.props.delegate.onMenuButton.bind(null, this.props.data.id)}>
              <div className="menu-icon"></div>
            </div>
            <div className="sw-grid-topbar_content-title">{title}</div>
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
  }
});

module.exports = Topbar;
