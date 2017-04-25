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
    this.hitWin = new Audio('https://s3-us-west-2.amazonaws.com/staging.swipesapp.com/uploads/ONY8E94FL/1493094279-UZTYMBVGO/hitwin.mp3');
    this.marioWin = new Audio('https://s3-us-west-2.amazonaws.com/staging.swipesapp.com/uploads/ONY8E94FL/1493094286-UZTYMBVGO/mariowin.mp3');
    this.saxWin = new Audio('https://s3-us-west-2.amazonaws.com/staging.swipesapp.com/uploads/ONY8E94FL/1493094293-UZTYMBVGO/saxwin.mp3');


    setTimeout(() => {
      this.setState({ shoot: true });
      this.setState({ shoot: false });
      this.marioWin.play();
    }, 10000);

    console.log('yo');
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
