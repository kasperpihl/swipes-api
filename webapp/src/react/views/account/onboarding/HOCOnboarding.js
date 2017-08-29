import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { map } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Onboarding from './Onboarding';

class HOCOnboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onClick(i, item, e) {
    const { browser, target, complete, openSecondary } = this.props;

    if(item.get('id') === 'personalize-swipes') {
      openSecondary({
        id: 'Profile',
        title: 'Profile',
      });
    } else if (['add-goal-milestone', 'create-milestone'].indexOf(item.get('id')) > -1) {
      openSecondary({
        id: 'MilestoneList',
        title: 'Milestones',
      });
    } else if(item.get('id') === 'create-goal') {
      openSecondary({
        id: 'TakeAction',
        title: 'Goals',
      });
    } else if(item.get('id') === 'invite-team') {
      openSecondary({
        id: 'Organization',
        title: 'Team account',
      });
    }
    else if(item.get('url')) {
      setTimeout(() => {
        complete(item.get('id'));
      }, 5000);

      browser(target, item.get('url'));
    }

  }
  render() {
    const { onboarding, userOnboarding } = this.props;
    const items = userOnboarding.get('order').map(
      (id) => onboarding.get(id).set('completed', !!userOnboarding.getIn(['completed',id]))
    );
    return (
      <Onboarding
        items={items}
        delegate={this}
      />
    );
  }
}
const { func } = PropTypes;

HOCOnboarding.propTypes = {
  onboarding: map,
  userOnboarding: map,
  complete : func,
};

function mapStateToProps(state) {
  return {
    onboarding: state.get('onboarding'),
    userOnboarding: state.getIn(['me', 'settings', 'onboarding']),
  };
}

export default navWrapper(connect(mapStateToProps, {
  complete: ca.onboarding.complete,
  browser: a.main.browser,
})(HOCOnboarding));