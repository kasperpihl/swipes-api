import React from 'react';
import ReactDOM from 'react-dom';
import Dot from './Dot';
import RadialMenu from './RadialMenu';
import GridMenu from './GridMenu';
import Overlay from './Overlay';

const getStyles = (props, state) => {
  let rootOpacity = 1;

  if (!state.open && !state.hoveredParent && props.showOnHover) {
    rootOpacity = 0;
  }

  return {
    root: {
      position: 'relative',
      opacity: rootOpacity
    }
  }
};

let initClientX = null;
let initClientY = null;

const SwipesDot = React.createClass({
  getInitialState() {
    return {
      open: false,
      hoveredParent: false,
      dotBoundRect: null
    }
  },
  componentDidMount() {
    const {hoverParentId} = this.props;
    const hoverParent = document.getElementById(hoverParentId);
    if(hoverParent){
      hoverParent.addEventListener('mouseenter', this.onMouseEnterParent);
      hoverParent.addEventListener('mouseleave', this.onMouseLeaveParent);
    }

  },
  onMouseEnterParent() {
    this.setState({
      hoveredParent: true
    })
  },
  onMouseLeaveParent() {
    this.setState({
      hoveredParent: false
    })
  },
  onMouseMove(e) {
    const {
      onDragStart
    } = this.props;

    e.stopPropagation();

    if (!initClientX && !initClientY) {
      initClientX = e.clientX;
      initClientY = e.clientY;
    }

    let xDiff = Math.abs(initClientX - e.clientX);
    let yDiff = Math.abs(initClientY - e.clientY);

    if (xDiff > 5 || yDiff > 5) {
      this.cleanUp();
      onDragStart();
    }
  },
  onMouseUp(e) {
    e.stopPropagation();
    this.cleanUp();
  },
  onMouseDownRoot(e) {
    const {
      open
    } = this.state;

    e.stopPropagation();
    e.preventDefault();

    if (open) {
      return;
    }

    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp);
  },
  onClickDot(e, boundRect) {
    this.setState({
      open: !this.state.open,
      dotBoundRect: boundRect
    })

    this.renderOverlayMenu(boundRect);

    e.stopPropagation();
  },
  renderOverlayMenu(boundRect) {

    const {
      elements,
      radial=false,
      reverse=false,
      labelOffset=100,
      menuColors={},
      labelStyles={}
    } = this.props;

    if(!elements || !elements.length){
      return; // No actions;
    }
    let div = document.getElementById('swipes-dot-overlay');

    if (div === null) {
      const id = document.createAttribute('id');

      div = document.createElement('div');
      id.value = 'swipes-dot-overlay';
      div.setAttributeNode(id);
      document.body.appendChild(div);
    }

    let menu;
    if (radial) {
      menu = (
        <RadialMenu
          onClickMenuItem={this.close}
          elements={elements}
          reverse={reverse}
          menuColors={menuColors}
          labelOffset={labelOffset}
          labelStyles={labelStyles} />
      )
    } else {
      menu = (
        <GridMenu
          onClickMenuItem={this.close}
          elements={elements}
          dotBoundRect={boundRect}
          reverse={reverse}
          labelOffset={labelOffset}
          labelStyles={labelStyles} />
      )
    }

    const overlay = (
      <div>
        <Overlay onClickClose={this.close} />
        {menu}
      </div>
    )

    ReactDOM.render(overlay, div);
  },
  cleanUp() {
    initClientX = null;
    initClientY = null;
    document.removeEventListener('mousemove', this.onMouseMove, false);
    document.removeEventListener('mouseup', this.onMouseUp, false);
  },
  close() {
    const div = document.getElementById('swipes-dot-overlay');

    this.setState({
      open: false,
      hoveredParent: false
    })

    ReactDOM.unmountComponentAtNode(div);
    document.body.removeChild(div);
  },
  render() {
    const {
      hoverParentId,
      radial=false,
      style={},
      elements,
      reverse,
      showOnHover,
      onDragData,
      ...other
    } = this.props;
    const {
      open,
      hoveredParent,
      dotBoundRect
    } = this.state;
    const styles = getStyles(this.props, this.state);

    return (
      <div
          {...other}
          onMouseDown={this.onMouseDownRoot}
          style={Object.assign({}, styles.root, style)}>
        <Dot
          onClickDot={this.onClickDot}
          open={open}
          hoveredParent={hoveredParent}
          radial={radial} />
      </div>
    )
  }
});

export default SwipesDot;
