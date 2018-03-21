import React, { PureComponent } from 'react';

// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';

import Icon from 'Icon';
// import AnimateNumber from 'react-animate-number';
import './styles/dashboard.scss';

class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      animatedNumbers: true
    };
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
    this.toggleNumberState = this.toggleNumberState.bind(this);
  }
  toggleNumberState() {
    const { animatedNumbers } = this.state;

    this.setState({ animatedNumbers: !animatedNumbers })
  }
  renderHeader() {
    

    return (
      <div className="dashboard__header">
        <div className="dashboard__title">The Work of Teams. United.</div>
        <div className="dashboard__logo" onClick={this.toggleNumberState}>
          <Icon icon="SwipesLogoEmpty" className="dashboard__svg" />
        </div>
      </div>
    )
  }
  renderNumbers() {
    const { animatedNumbers } = this.state;

    if (animatedNumbers) {
      return (
        <div className="card__number">
          {/*<AnimateNumber number={10000} speed={50}/>*/}
        </div>
      )
    }
    
    return (
      <div className="card__number">
        0
      </div>
    )
  }
  renderCard() {
    
    return (
      <div className="dashboard__card-wrapper">
        <div className="card">
          {this.renderNumbers()}
          <div className="card__label">users</div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="dashboard">
        {this.renderHeader()}
        {this.renderCard()}
      </div>
    );
  }
}

export default Dashboard

// const { string } = PropTypes;

Dashboard.propTypes = {};
