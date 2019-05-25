import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { prefix } from 'inline-style-prefixer';
import './styles/loader.scss';

const TIMER = 150; // Milliseconds between moving the next block
const TRANSITION = 0.5; // Seconds to actually move one block
const DEF_SIZE = 60; // Pixels height/width
const GUTTER = 5; // Spacing in percentage between tiles
const MINI_GUTTER = 10;
const initialState = {
  positions: {
    1: 'alpha',
    2: 'bravo',
    3: 'charlie',
    4: null,
    5: 'delta',
    6: 'echo',
    7: 'foxtrot'
  },
  stateNumber: 0
};

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  clipPathForPosition(position) {
    const { mini } = this.props;
    position = parseInt(position, 10);
    let SIZE = (100 - 2 * GUTTER) / 3;
    let GUT = GUTTER;
    if (mini) {
      SIZE = (100 - GUTTER) / 2;
      GUT = MINI_GUTTER;
    }
    const VAR0 = '0% ';
    const VAR1 = `${SIZE + GUT}% `;
    const VAR2 = `${2 * SIZE + 2 * GUT}% `;
    if (mini) {
      switch (position) {
        case 1:
          return `inset(${VAR0}${VAR1}${VAR1}${VAR0} round 5%)`;
        case 2:
          return `inset(${VAR0}${VAR0}${VAR1}${VAR1} round 5%)`;
        case 3:
          return `inset(${VAR1}${VAR0}${VAR0}${VAR1} round 5%)`;
        case 4:
          return `inset(${VAR1}${VAR1}${VAR0}${VAR0} round 5%)`;
        default:
          return `inset(${VAR1}${VAR1}${VAR0}${VAR0} round 5%)`;
      }
    } else {
      switch (position) {
        case 1:
          return `inset(${VAR1}${VAR2}${VAR1}${VAR0} round 5%)`;
        case 2:
          return `inset(${VAR0}${VAR2}${VAR2}${VAR0} round 5%)`;
        case 3:
          return `inset(${VAR0}${VAR1}${VAR2}${VAR1} round 5%)`;
        case 4:
          return `inset(${VAR1}${VAR1}${VAR1}${VAR1} round 5%)`;
        case 5:
          return `inset(${VAR2}${VAR1}${VAR0}${VAR1} round 5%)`;
        case 6:
          return `inset(${VAR2}${VAR0}${VAR0}${VAR2} round 5%)`;
        case 7:
          return `inset(${VAR1}${VAR0}${VAR1}${VAR2} round 5%)`;
        default:
          return `inset(${VAR1}${VAR0}${VAR1}${VAR2} round 5%)`;
      }
    }
  }

  positionForTile(radioCommand) {
    const keys = Object.keys(this.state.positions);
    let foundKey;
    keys.forEach(key => {
      const tile = this.state.positions[key];
      if (tile === radioCommand) {
        foundKey = key;
      }
    });

    return foundKey;
  }

  renderTiles() {
    let squares = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'];
    if (this.props.mini) {
      squares = squares.slice(0, 3);
    }

    return squares.map(radioCommand => {
      const pos = this.positionForTile(radioCommand);
      const styles = {
        transition: `${TRANSITION}s cubic-bezier(0.86, 0, 0.07, 1)`,
        WebkitClipPath: this.clipPathForPosition(pos)
      };
      return (
        <div
          key={`rect-${radioCommand}`}
          style={prefix(styles)}
          className={`rect ${radioCommand}`}
        />
      );
    });
  }
  renderText(text, textStyle) {
    if (text && text.length) {
      return (
        <div className="sw-loader__wrapper__text" style={textStyle}>
          {text}
        </div>
      );
    }
    return undefined;
  }
  render() {
    const { size, style, center, text, textStyle, textPosition } = this.props;
    const styles = Object.assign(
      {
        width: `${DEF_SIZE}px`,
        height: `${DEF_SIZE}px`
      },
      style
    );

    if (size) {
      styles.width = `${size}px`;
      styles.height = `${size}px`;
    }

    let className = 'sw-loader';

    if (center) {
      className += ' sw-loader--center';
    }

    if (textPosition === 'right') {
      className += ' sw-loader--text-right';
    }

    return (
      <div style={styles} className={className}>
        <div className="sw-loader__wrapper">{this.renderTiles()}</div>
        {this.renderText(text, textStyle)}
      </div>
    );
  }
}
export default Loader;

const { number, bool, string, object } = PropTypes;
Loader.propTypes = {
  size: number,
  center: bool,
  mini: bool,
  text: string,
  textStyle: object,
  textPosition: string,
  style: object
};
