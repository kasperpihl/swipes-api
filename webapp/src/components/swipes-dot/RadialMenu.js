import React from 'react';
import RadialMenuItem from './RadialMenuItem'

const getStyles = (props, state) => {
  const {
    labelOffset
  } = props;

  let labelLeft = '';
  let labelRight = '';

  if (props.reverse) {
    labelRight = labelOffset;
  } else {
    labelLeft = labelOffset;
  }

  let labelOpacity = '0';

  if (state.visible) {
    labelOpacity = '1';
  }

  return {
    root: {
      position: 'absolute',
      // We need 0,0 to be at the center of the dot.
      left: '4px',
      top: '4px'
    },
    label: {
      position: 'absolute',
      zIndex: '9999',
      left: `${labelLeft}px`,
      right: `${labelRight}px`,
      top: '-8px',
      fontSize: '1.05em',
      lineHeight: '1.05em',
      fontWeight: '300',
      whiteSpace: 'nowrap',
      borderRadius: '3px',
      color: 'rgba(255,255,255,.9)',
      backgroundColor: 'rgba(0,0,0,.5)',
      boxShadow: 'inset 0px 0px 33px -5px rgba(0,0,0,1)',
      opacity: labelOpacity
    }
  }
};

const RadialMenu = React.createClass({
  getInitialState() {
    return {
      visible: false,
      label: ''
    }
  },
  calcPositions(count, reverse) {
    const semicircle = 180;
    const radius = 70;
    const origin = 0;
    const sector = semicircle / count;
    const halfSector = sector / 2;
    // We want 0 degree from the top of the circle
    const magicCorrection = 270;
    const positions = [];

    for (let i=1; i<=count; i++) {
      const degree = ((sector * i) - halfSector) + magicCorrection;
      const radians = Math.PI * degree / semicircle;
      const y = origin + radius * Math.sin(radians);
      let x = origin + radius * Math.cos(radians);

      if (reverse) {
        x = x * -1;
      }

      positions.push({
        x: x,
        y: y
      })
    }

    return positions;
  },
  menuItems(styles) {
    const {
      open,
      elements,
      reverse,
      menuColors,
      onClickMenuItem
    } = this.props;
    const positions = this.calcPositions(elements.length, reverse);
    const items = [];

    positions.forEach((position, index) => {
      const element = elements[index];
      const {x, y} = position;

      items.push(
        <RadialMenuItem
          key={index}
          open={open}
          element={element}
          onClickMenuItem={onClickMenuItem}
          style={{left: x, top: y}}
          menuColors={menuColors}
          showLabelTextCallback={this.showLabel}
          hideLabelTextCallback={this.hideLabel} />
      )
    })

    return items;
  },
  showLabel(text) {
    this.setState({
      visible: true,
      label: text
    })
  },
  hideLabel() {
    this.setState({
      visible: false
    })
  },
  render() {
    const {
      label
    } = this.state;
    const {
      labelStyles
    } = this.props;
    const styles = getStyles(this.props, this.state);

    // We handle this with labelOffset prop in getStyles
    if (labelStyles.left) {
      delete labelStyles.left;
    }
    if (labelStyles.right) {
      delete labelStyles.right;
    }

    return (
      <div style={Object.assign({}, styles.root)}>
        <div style={Object.assign({}, styles.label, labelStyles)}>
          {label}
        </div>
        {this.menuItems(styles)}
      </div>
    )
  }
});

export default RadialMenu;
