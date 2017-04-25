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
      counter: 0,
      prevCelebrate: 0,
    };
  }
  componentWillMount() {
    this.fetchAndSet();
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
  componentDidUpdate(prevProps, prevState) {

  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  fetchAndSet() {
    const headers = new Headers({
      'Content-Type': 'application/json',
      method: 'GET',
    });
    fetch('http://localhost:1337', { headers }).then((r) => {
      if (r && r.ok) return r.json();
      return Promise.reject({ message: r.statusText, code: r.status });
    }).then((res) => {
      if(res.result !== this.state.counter && !this._unmounted) {
        this.setState({ counter: res.result});
      }
    }).catch((e) => {
      console.log('err', e);
    })
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
    const { counter } = this.state;
    return (
      <div className="counter">
        <div className="counter__count">{counter}</div>
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
