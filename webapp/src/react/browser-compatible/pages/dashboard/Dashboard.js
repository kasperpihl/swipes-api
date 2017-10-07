import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import { setupDelegate } from 'react-delegate';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import AnimateNumber from 'react-animate-number';
import './styles/dashboard.scss';

class Dashboard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderHeader() {
    

    return (
      <div className="dashboard__header">
        <div className="dashboard__title">The Work of Teams. United.</div>
        <div className="dashboard__logo">
          <Icon icon="SwipesLogoEmpty" className="dashboard__svg" />
        </div>
      </div>
    )
  }
  renderCard() {
    
    return (
      <div className="dashboard__card-wrapper">
        <div className="card">
          <div className="card__number">
            <AnimateNumber number={1000} speed={2}/>
          </div>
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
