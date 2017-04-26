import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import Confetti from 'react-dom-confetti';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Icon from 'Icon';
import './styles/counter.scss';

class HOCCounter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shoot: false,
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
  }
  componentDidUpdate(prevProps, prevState) {
    const { counter } = this.state;
    const celebration = this.getCelebrationForNumber(counter);
    if (celebration) {
      this[celebration].play();
      this.runCelebration();
      this.setState({ prevCelebrate: counter });
    }

    console.log(this.state);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  getCelebrationForNumber(counter) {
    const { prevCelebrate } = this.state;
    if (counter === prevCelebrate) {
      return undefined;
    }
    if (counter % 1000 === 0) {
      return 'hitWin';
    }
    if (counter % 100 === 0) {
      return 'saxWin';
    }
    if (counter % 10 === 0) {
      return 'marioWin';
    }
    return undefined;
  }
  runCelebration() {
    this.setState({
      shoot: true,
    }, () => {
      this.setState({ shoot: false });
    });
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
      this.setState({ ...res });
    }).catch((e) => {
      console.log('err', e);
    });
    if (!this._unmounted) {
      setTimeout(() => this.fetchAndSet(), 5000);
    }
  }
  renderHeader() {
    return (
      <div className="counter__header">
        <div className="counter__header-title">The Work of Teams. United.</div>
        <div className="counter__header-icon">
          <Icon icon="SwipesLogoEmpty" className="counter__svg" />
        </div>
      </div>
    );
  }
  renderCard(number, text, big) {
    let cardClass = 'counter__card';
    let numberClass = 'counter__number';

    if (big) {
      cardClass += ' counter__card--big';
      numberClass += ' counter__number--big';
    } else {
      cardClass += ' counter__card--small';
      numberClass += ' counter__number--small';
    }

    return (
      <div className={cardClass}>
        <div className={numberClass}>
          {number}
        </div>
        <div className="counter__text">{text}</div>
      </div>
    );
  }
  renderFooter() {
    return (
      <div className="counter__footer">
        Day 1 • The Workspace
      </div>
    );
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
    const { milestones, organizations, pendingUsers, users, goals } = this.state;
    return (
      <div className="counter">

        <div className="counter__confetti counter__confetti--left">
          <Confetti active={this.state.shoot} config={leftConfig} />
        </div>
        <div className="counter__confetti counter__confetti--right">
          <Confetti active={this.state.shoot} config={rightConfig} />
        </div>

        {this.renderHeader()}

        <div className="counter__content">
          <div className="counter__col counter__col--small">
            {this.renderCard(pendingUsers, 'pending invites')}
            {this.renderCard(organizations, 'organizations')}
          </div>
          <div className="counter__col counter__col--big">
            {this.renderCard(users, 'users', true)}
          </div>
          <div className="counter__col counter__col--small">
            {this.renderCard(goals, 'goals')}
            {this.renderCard(milestones, 'milestones')}
          </div>
        </div>

        {this.renderFooter()}
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
