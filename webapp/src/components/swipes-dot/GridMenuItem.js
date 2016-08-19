import React from 'react';

const getStyles = (props, state) => {
  let rootBgColor = '#FFFFFF';
  let iconColor = '#666D82';
  let iconTransform = 'none';
  let labelTransform = 'translate(-50%, 50px)'
  let transition = 'transform .15s ease-in';

  if (state.hoveredRoot) {
    rootBgColor = props.element.bgColor;
    iconColor = '#FFFFFF';
    iconTransform = 'translateY(-10px)';
    labelTransform = 'translate(-50%, 10px)';
  }

  return {
    root: {
      width: '70px',
			height: '70px',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: rootBgColor,
			opacity: '1',
      transition: 'opacity .1s .1s',
      flexDirection: 'column',
      position: 'relative'
    },
    icon: {
      fontSize: '20px',
      color: iconColor,
      cursor: 'default',
      opacity: '1',
      transform: iconTransform,
      transition: transition
    },
    label: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      opacity: '1',
      fontSize: '10px',
      fontWeight: '700',
      letterSpacing: '.7px',
      color: 'white',
      textTransform: 'uppercase',
      textAlign: 'center',
      cursor: 'default',
      transform: labelTransform,
      transition: transition
    }
  }
};

const GridMenuItem = React.createClass({
  getInitialState() {
    return {
      hoveredRoot: false
    }
  },
  componentWillMount() {
    const {
      element
    } = this.props;

    if (element._init) {
      // We set _init in grid-menu componentWillMount method
      // We do this because otherwise there is no mouseEnter event
      // on the first item when we show the menu if the user don't move
      // its mouse.
      this.setState({
        hoveredRoot: true
      })
    }
  },
  onEnterRoot() {
    const {
      element
      //showLabelTextCallback
    } = this.props;

    this.setState({
      hoveredRoot: true
    });
    //showLabelTextCallback(element.label);
  },
  onLeaveRoot() {
    // const {
    //   hideLabelTextCallback
    // } = this.props;

    this.setState({
      hoveredRoot: false
    });
    //hideLabelTextCallback();
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
        <div style={Object.assign({}, styles.label)}>
          {element.label}
        </div>
      </div>
    )
  }
})

export default GridMenuItem;
