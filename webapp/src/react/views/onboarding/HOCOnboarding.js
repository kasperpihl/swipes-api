import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { map } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Onboarding from './Onboarding';

class HOCOnboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onClick(i, e) {
    console.log('i', i, e);
    const { browser, target, userOnboarding, complete } = this.props;
    browser(target, 'http://youtube.com');
    complete(userOnboarding.getIn(['order', i]));
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

export default connect(mapStateToProps, {
  complete: ca.onboarding.complete,
  browser: a.main.browser,
})(HOCOnboarding);
