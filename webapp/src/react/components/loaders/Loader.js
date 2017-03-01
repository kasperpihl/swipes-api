import React, { Component, PropTypes } from 'react';
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
    7: 'foxtrot',
  },
  stateNumber: 0,
};

class Loader extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.setNextState = this.setNextState.bind(this);
  }
  componentDidMount() {
    this.setTimer(TIMER);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }
  setTimer(time) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(this.setNextState, time);
  }
  setNextState() {
    const currentPositions = this.state.positions;
    const emptyIndex = this.positionForTile(null);
    const indexToMove = this.tileIndexToMove();
    const newPositions = Object.assign({}, currentPositions, {
      [indexToMove]: null,
      [emptyIndex]: currentPositions[indexToMove],
    });

    const currentState = this.state.stateNumber;
    const maxState = this.props.mini ? 3 : 7;
    const nextState = (currentState === maxState) ? 0 : currentState + 1;


    this.setState({ stateNumber: nextState, positions: newPositions });
  }
  clipPathForPosition(position) {
    const { mini } = this.props;
    position = parseInt(position, 10);
    let SIZE = (100 - (2 * GUTTER)) / 3;
    let GUT = GUTTER;
    if (mini) {
      SIZE = (100 - GUTTER) / 2;
      GUT = MINI_GUTTER;
    }
    const VAR0 = '0% ';
    const VAR1 = `${SIZE + GUT}% `;
    const VAR2 = `${(2 * SIZE) + (2 * GUT)}% `;
    if (mini) {
      switch (position) {
        case 1: return `inset(${VAR0}${VAR1}${VAR1}${VAR0} round 5%)`;
        case 2: return `inset(${VAR0}${VAR0}${VAR1}${VAR1} round 5%)`;
        case 3: return `inset(${VAR1}${VAR0}${VAR0}${VAR1} round 5%)`;
        case 4: return `inset(${VAR1}${VAR1}${VAR0}${VAR0} round 5%)`;
        default: return `inset(${VAR1}${VAR1}${VAR0}${VAR0} round 5%)`;
      }
    } else {
      switch (position) {
        case 1: return `inset(${VAR1}${VAR2}${VAR1}${VAR0} round 5%)`;
        case 2: return `inset(${VAR0}${VAR2}${VAR2}${VAR0} round 5%)`;
        case 3: return `inset(${VAR0}${VAR1}${VAR2}${VAR1} round 5%)`;
        case 4: return `inset(${VAR1}${VAR1}${VAR1}${VAR1} round 5%)`;
        case 5: return `inset(${VAR2}${VAR1}${VAR0}${VAR1} round 5%)`;
        case 6: return `inset(${VAR2}${VAR0}${VAR0}${VAR2} round 5%)`;
        case 7: return `inset(${VAR1}${VAR0}${VAR1}${VAR2} round 5%)`;
        default: return `inset(${VAR1}${VAR0}${VAR1}${VAR2} round 5%)`;
      }
    }
  }
  tileIndexToMove() {
    switch (this.state.stateNumber) {
      case 0: return 3;
      case 1: return 2;
      case 2: return 1;
      case 3: return 4;
      case 4: return 7;
      case 5: return 6;
      case 6: return 5;
      case 7: return 4;
      default: return 3;
    }
  }
  positionForTile(radioCommand) {
    const keys = Object.keys(this.state.positions);
    let foundKey;
    keys.forEach((key) => {
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

    return squares.map((radioCommand) => {
      const pos = this.positionForTile(radioCommand);
      const styles = {
        transition: `${TRANSITION}s cubic-bezier(0.86, 0, 0.07, 1)`,
        WebkitClipPath: this.clipPathForPosition(pos),
      };
      return <div key={`rect-${radioCommand}`} style={styles} className={`rect ${radioCommand}`} />;
    });
  }
  renderText(text, textStyle) {
    if (text && text.length) {
      return <div className="sw-loader__wrapper__text" style={textStyle}>{text}</div>;
    }
    return undefined;
  }
  render() {
    const { size, style, center, text, textStyle, textPosition } = this.props;
    const styles = Object.assign({
      width: `${DEF_SIZE}px`,
      height: `${DEF_SIZE}px`,
    }, style);

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
        <div className="sw-loader__wrapper">
          {this.renderTiles()}
        </div>
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
  style: object,
};
