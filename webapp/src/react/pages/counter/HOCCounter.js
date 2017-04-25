import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Confetti from 'react-dom-confetti';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import './styles/counter.scss';

class HOCCounter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shoot: false,
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ shoot: true });
      const audio = new Audio('src/react/pages/counter/sounds/marioWin.mp3');
      audio.play();
    }, 10000);
  }
  render() {
    const leftConfig = {
      angle: 45,
      spread: 90,
      startVelocity: 60,
      elementCount: 300,
      decay: 0.95,
    };

    const rightConfig = {
      angle: 136,
      spread: 90,
      startVelocity: 60,
      elementCount: 300,
      decay: 0.95,
    };

    return (
      <div className="counter">
        <div className="counter__count">101</div>
        <div className="counter__confetti counter__confetti--left">
          <Confetti active={this.state.shoot} config={leftConfig} />
        </div>
        <div className="counter__confetti counter__confetti--right">
          <Confetti active={this.state.shoot} config={rightConfig} />
        </div>
      </div>
    );
  }
}
// const { string } = PropTypes;

HOCCounter.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCCounter);
