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
  openDropdownMenu() {
    this.setState({dropdownMenu: !this.state.dropdownMenu})
  },
  onChangeMenu(id){
    if(id === 'menu'){
      this.props.callGridDelegate('gridRowPressedMenu', this.props.data.id);
    }
    if(id === 'remove'){
      this.props.callGridDelegate('gridRowPressedRemove', this.props.data.id);
    }
  },
  render() {



    const {
      data
    } = this.props;
    var options = this.props.callGridDelegate('gridOptionsForTopbar', data.id);

    let className = "sw-grid-topbar";
    let onclickHandler;
    let title = options.title;
    let subtitle = options.subtitle;

    if ( this.state.dropdownMenu ) {
      className += ' sw-grid-topbar--shown'
    }

    const dropdownStructure = [
      { title: 'Tile menu', id: 'menu' }
    ];

    const dropdownStyles = {
      top: '30px',
      right: '0px'
    }

    if (this.props.data.collapsed) {
      onclickHandler = this.onClick;
      let splittedTitle = title.split("").map((char, i) => {
        return <div style={{minHeight: "22px"}} key={"char-" + i} className="collapsed__title--letter">{char}</div>
      });
      splittedTitle = <div style={{minHeight: "22px"}} className="collapsed__title--letter">{title}</div>
      return (
        <div className={className} onMouseDown={this.onMouseDown} onClick={onclickHandler}>
          <div className="sw-grid-topbar_content">
            <div className="sw-grid-topbar_content-title">
              {splittedTitle}
            </div>
          </div>
        </div>
      )
    } else {

      return (
        <div className={className} onMouseDown={this.onMouseDown} onClick={onclickHandler}>
          <div className="sw-grid-topbar__content" onClick={this.onTitleClick}>
            <div className="sw-grid-topbar__content--title">{title}</div>
          </div>

          <div className="sw-grid-topbar__actions">
            {/*<div className="sw-grid-topbar__actions--collapse" onClick={this.props.delegate.onCollapse.bind(null, this.props.data.id)}>
              <div className="collapse-icon">
                <CollapseIcon />
              </div>
            </div>

            <div className="sw-grid-topbar__actions--fullscreen" onClick={this.props.delegate.onFullscreen.bind(null, this.props.data.id)}>
              <div className="fullscreen-icon">
                <FullscreenIcon />
              </div>
            </div>*/}

            <div className="sw-grid-topbar__actions--context">
              <div className="context-icon" onClick={this.openDropdownMenu}>
                <ContextIcon />
                <DropdownMenu show={this.state.dropdownMenu} data={dropdownStructure} onChange={this.onChangeMenu} reverse={true} styles={dropdownStyles}/>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }
});

module.exports = Topbar;
