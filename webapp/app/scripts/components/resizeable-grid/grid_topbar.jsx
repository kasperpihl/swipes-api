var React = require('react');

var initClientX = null;
var initClientY = null;

var Topbar = React.createClass({
  onClick(e) {
    if (this.props.data.collapsed) {
      this.props.delegate.onExpand(this.props.data.id);
    }
  },
  onMouseMove(e){
    e.stopPropagation();

    if (!initClientX && !initClientY) {
      initClientX = e.clientX;
      initClientY = e.clientY;
    }

    var xDiff = Math.abs(initClientX - e.clientX);
    var yDiff = Math.abs(initClientY - e.clientY);

    if (xDiff > 5 || yDiff > 5) {
      this.cleanUp();
      const {columnIndex, rowIndex } = this.props;
      this.props.delegate.rowDidStartDragging(columnIndex, rowIndex);
    }
  },
  cleanUp(){
    initClientX = null;
    initClientY = null;
    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
  },
  onMouseUp(e) {
    e.stopPropagation();
    this.cleanUp();
  },
  onMouseDown(e) {
    e.stopPropagation();
    e.preventDefault();
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp);
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
        <div className={className} onMouseDown={this.onMouseDown} onClick={onclickHandler}>
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
        <div className={className} onMouseDown={this.onMouseDown} onClick={onclickHandler}>
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
