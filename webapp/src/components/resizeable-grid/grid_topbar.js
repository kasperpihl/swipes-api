var React = require('react');

import CollapseIcon from './images/sw-collapse-icon.svg';
import FullscreenIcon from './images/sw-fullscreen-icon.svg';
import ContextIcon from './images/sw-context-icon.svg';

import DropdownMenu from '../swipes-ui/DropdownMenu';

var initClientX = null;
var initClientY = null;

var Topbar = React.createClass({
  onClick(e) {
    if (this.props.data.collapsed) {
      this.props.delegate.onExpand(this.props.data.id);
    }
  },
  onTitleClick(e){
    this.props.callGridDelegate('gridRowPressedMenu', this.props.data.id);
  },
  getInitialState(){
    return {
      dropdownMenu: false
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
  renderClickBg() {
    if (this.state.dropdownMenu) {
      return (
        <div className="context-menu__click-bg"></div>
      )
    }
  },
  renderContextItems() {
    let menuClass = 'context-menu--closed';

    if (this.state.dropdownMenu) {
      menuClass = 'context-menu--open'
    }
    return (
      <div className={"context-menu " + menuClass}>
        <div className="context-menu__element">
          <div className="context-menu__element--text">
            Settings
          </div>
        </div>
        <div className="context-menu__element" onClick={this.props.delegate.onMenuButton.bind(null, this.props.data.id)}>
          <div className="context-menu__element--text">
            Close
          </div>
        </div>
      </div>
    )
  },
  openDropdownMenu() {
    this.setState({dropdownMenu: !this.state.dropdownMenu})
  },
  onChangeMenu(id){
    if(id === 'settings'){
      console.log(id)
    }
    if(id === 'remove'){
      console.log(id)
    }
  },
  render() {
    const {
      data
    } = this.props;
    let className = "sw-grid-topbar";
    let onclickHandler;
    let title = 'Chat';

    if ( this.state.dropdownMenu ) {
      className += ' sw-grid-topbar--shown'
    }

    const dropdownStructure = [
      { title: 'Settings', id: 'settings' },
      { title: 'Remove Tile', id: 'remove' },
    ];

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
          <div className="sw-grid-topbar__content" onClick={this.onTitleClick}>
            <div className="sw-grid-topbar__content--title">{title}</div>
            <div className="sw-grid-topbar__content--seperator"></div>
            <div className="sw-grid-topbar__content--subtitle">Swipes Team</div>
          </div>

          <div className="sw-grid-topbar__actions">
            <div className="sw-grid-topbar__actions--collapse" onClick={this.props.delegate.onCollapse.bind(null, this.props.data.id)}>
              <div className="collapse-icon">
                <CollapseIcon />
              </div>
            </div>

            <div className="sw-grid-topbar__actions--fullscreen" onClick={this.props.delegate.onFullscreen.bind(null, this.props.data.id)}>
              <div className="fullscreen-icon">
                <FullscreenIcon />
              </div>
            </div>

            <div className="sw-grid-topbar__actions--context">
              <div className="context-icon" onClick={this.openDropdownMenu}>
                <ContextIcon />
                <DropdownMenu show={this.state.dropdownMenu} data={dropdownStructure} onChange={this.onChangeMenu} reverse={true} />
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
});

module.exports = Topbar;
