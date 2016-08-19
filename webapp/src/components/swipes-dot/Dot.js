import React from 'react';

const getStyles = (props, state) => {
  const yellow = '#FFCA28';
  const deepBlue = '#000C2F';

  let dotTransform = '';

  if (state.hoveredRoot) {
    dotTransform = 'scale(1.6)';
  }

  let secondDotTransform = '';

  if (props.hoveredParent && !props.open) {
    if (state.hoveredRoot) {
      secondDotTransform = 'scale(4.2)';
    } else {
      secondDotTransform = 'scale(2.5)';
    }
  }

  let closeIconTransform = 'scale(0) rotate(360deg)';
  let dotColor = yellow;
  let dotTransition = '.1s linear';

  if (props.open && props.radial) {
    dotTransition = '.2s ease-in-out';
    dotTransform = 'scale(4)';
    secondDotTransform = 'scale(0)';
    closeIconTransform = 'scale(1) rotate(0deg)';
    dotColor = deepBlue;
  }

  return {
    dot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      position: 'absolute',
      left: '0px',
      top: '0px',
      zIndex: '9999',
      background: dotColor,
      transition: dotTransition,
      transform: dotTransform
    },
    secondDot: {
      width: '8px',
      height: '8px',
      position: 'absolute',
      left: '0px',
      top: '0px',
      zIndex: '9998',
      borderRadius: '50%',
      background: dotColor,
      transition: '.1s linear',
      opacity: '0.4',
      transform: secondDotTransform
    },
    closeIcon: {
      position: 'absolute',
      left: '2px',
      top: '2px',
      fontSize: '4px',
      cursor: 'default',
      transform: closeIconTransform,
      transition: '.2s ease-in-out'
    }
  }
}

const Dot = React.createClass({
  getInitialState() {
    return {
      hoveredRoot: false
    }
  },
  onEnterRoot() {
    this.setState({
      hoveredRoot: true
    })
  },
  onLeaveRoot() {
    this.setState({
      hoveredRoot: false
    })
  },
  onClick(e) {
    // T_TODO will do moving the grid after I make the grid
    const {
      onClickDot
    } = this.props;
    const dotElement = this.refs.dotRoot;
    const boundRect = dotElement.getBoundingClientRect();

    onClickDot(e, boundRect);
  },
  render() {
    const {
      radial
    } = this.props;
    const styles = getStyles(this.props, this.state);

    let closeIcon;
    if (radial) {
      // TODO put a close icon here
      closeIcon = ''
    }

    return (
      <div
        ref="dotRoot"
        onMouseEnter={this.onEnterRoot}
        onMouseLeave={this.onLeaveRoot}
        onClick={this.onClick}
      >
        <div style={Object.assign({}, styles.dot)}>
          {closeIcon}
        </div>
        <div style={Object.assign({}, styles.secondDot)}></div>
      </div>
    )
  }
});

export default Dot;
