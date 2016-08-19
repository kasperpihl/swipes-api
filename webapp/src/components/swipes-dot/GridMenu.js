import React from 'react';
import clone from 'clone';
import GridMenuItem from './GridMenuItem'

const menuItemWidth = 70;
const halfMenuItemWidth = menuItemWidth / 2;

const getStyles = (props, state) => {
  let rootLeft = 0;
  let rootTop = 0;

  if (props.dotBoundRect) {
    rootLeft = props.dotBoundRect.left - halfMenuItemWidth;
    rootTop = props.dotBoundRect.top - halfMenuItemWidth;

    if (rootLeft < 0) {
      rootLeft = 0;
    }

    if (rootTop < 0) {
      rootTop = 0;
    }

    if (props.reverse) {
      // T_TODO find the row with most items and calculate by that
      const elements = state.elements;
      const len = elements[0].length - 1;
      const vw = document.body.clientWidth;

      if (rootLeft + menuItemWidth > vw) {
        rootLeft = vw - menuItemWidth;
      }

      rootLeft = rootLeft - (menuItemWidth * len);
    }

    if (state.reverseVert) {
      const elements = state.elements;
      const len = elements.length - 1;

      rootTop = rootTop - (menuItemWidth * len);
    }
  }

  return {
    root: {
      position: 'fixed',
      left: rootLeft + 'px',
      top: rootTop + 'px',
      display: 'flex',
      overflow: 'hidden',
      borderRadius: '3px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.12)',
      transition: '.1s',
      transitionDelay: '.1s',
      zIndex: '9999',
      flexDirection: 'column'
    },
    ripple: {
      width: '20px',
  		height: '20px',
  		position: 'absolute',
  		backgroundColor: 'white',
  		borderRadius: '50%',
  		transform: 'scale(30)',
  		transition: '.18s cubic-bezier(1,.03,.16,.96)'
    },
    row: {
      display: 'flex',
      zIndex: '2'
    }
  }
};

const GridMenu = React.createClass({
  _reverseRows(reverse, elements) {
    elements.forEach((row, i) => {
      if (i===0) {
        row[0]._init = true;
      }

      if (reverse) {
        row.reverse();
      }
    })
  },
  getInitialState() {
    return {
      elements: [],
      reverseVert: false
    }
  },
  componentWillMount() {
    const {
      elements,
      reverse,
      dotBoundRect
    } = this.props;

    // Using document.documentElement because
    // that way we don't care if we have horizontal scroll
    const vh = document.documentElement.clientHeight;
    const top = dotBoundRect.top;
    const diff = vh - top;
    const rowsCount = elements.length;
    const gridHeight = rowsCount * menuItemWidth;
    const clonedElements = clone(elements);
    let reverseVert = false;

    this._reverseRows(reverse, clonedElements);

    if (diff < gridHeight) {
      const firstElement = clonedElements.shift();

      clonedElements.push(firstElement);
      reverseVert = true;
    }

    this.setState({
      elements: clonedElements,
      reverseVert: reverseVert
    });
  },
  menuItems(styles) {
    const {
      onClickMenuItem
    } = this.props;
    const {
      elements
    } = this.state;
    let rows = [];

    elements.forEach(function (row, i) {
      let cells = [];

      row.forEach(function(cell, j) {
        cells.push(
          <GridMenuItem
            key={j}
            element={cell}
            onClickMenuItem={onClickMenuItem} />
        )
      })

      rows.push(
        <div key={i} style={Object.assign({}, styles.row)}>
          {cells}
        </div>
      )
    })

    return rows;
  },
  render() {
    const styles = getStyles(this.props, this.state);

    return (
      <div style={Object.assign({}, styles.root)}>
        <div style={Object.assign({}, styles.ripple)}></div>
        {this.menuItems(styles)}
      </div>
    )
  }
});

export default GridMenu;
