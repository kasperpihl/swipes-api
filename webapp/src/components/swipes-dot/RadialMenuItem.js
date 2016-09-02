import React from 'react';

const getStyles = (props, state) => {
  const rootSize = '34'
  const menuColors = props.menuColors;

  let rootTransform = 'scale(0)';
  let rootTransition = '.25s ease-in-out';
  let rootOpacity = '0';
  let rootLeft = '0';
  let rootTop = rootSize / 2 * -1;
  let rootBorderColor = menuColors.borderColor || 'red';
  let rootBackgroundColor = menuColors.backgroundColor || 'white';

  let iconColor = menuColors.iconColor || '#333ddd';
  let iconTransition = '';

  if (props.open) {
    rootTransform = 'scale(1)';
    rootOpacity = '1';

     // An offset so the origin would be in the center of the item
    rootLeft = props.style.left - (rootSize / 2);
    rootTop = props.style.top - (rootSize / 2);
  }

  if (state.hoveredRoot) {
    rootTransform = 'scale(1.15)';
    rootTransition = '.15s ease-in-out';
    rootBorderColor = menuColors.hoverBorderColor || 'white';
    rootBackgroundColor = menuColors.hoverBackgroundColor || 'transparent';

    iconColor = menuColors.hoverIconColor || 'red';
    iconTransition = '.15s ease-in-out';
  }

  return {
    root: {
      display: 'flex',
    	alignItems: 'center',
    	justifyContent: 'center',
      position: 'absolute',
      width: rootSize + 'px',
      height: rootSize + 'px',
      borderRadius: '50%',
      backgroundColor: rootBackgroundColor,
      transition: rootTransition,
      transform: rootTransform,
      opacity: rootOpacity,
      left: rootLeft + 'px',
      top: rootTop + 'px',
      border: `1px solid ${rootBorderColor}`,
      zIndex: '9999'
    },
    icon: {
      color: iconColor,
      fontSize: '14px',
      cursor: 'default',
      transition: iconTransition
    }
  }
};

const RadialMenuItem = React.createClass({
  getInitialState() {
    return {
      hoveredRoot: false
    }
  },
  onEnterRoot() {
    const {
      element,
      showLabelTextCallback
    } = this.props;

    this.setState({
      hoveredRoot: true
    });
    showLabelTextCallback(element.label);
  },
  onLeaveRoot() {
    const {
      hideLabelTextCallback
    } = this.props;

    this.setState({
      hoveredRoot: false
    });
    hideLabelTextCallback();
  },
  onClickRoot(e) {
    const {
      element,
      onClickMenuItem
    } = this.props;

    element.callback();
    onClickMenuItem();

    e.stopPropagation();
  },
  render() {
    const {
      element
    } = this.props;
    const styles = getStyles(this.props, this.state);

    return (
      <div
        onMouseEnter={this.onEnterRoot}
        onMouseLeave={this.onLeaveRoot}
        onClick={this.onClickRoot}
        style={Object.assign({}, styles.root)}>
        <i
          style={Object.assign({}, styles.icon)}
          className="material-icons">
          {element.icon}
        </i>
      </div>
    )
  }
})

export default RadialMenuItem;
