import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Onboarding from './Onboarding';

class HOCOnboarding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const settings = {
      onboarding: {
        initial: ['create-account', ''],
        completed: {

        }

      }
    }
  }
  onClick(i, e) {
    console.log('i', i, e);
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
// const { string } = PropTypes;

HOCOnboarding.propTypes = {};

function mapStateToProps(state) {
  return {
    onboarding: state.get('onboarding'),
    userOnboarding: state.getIn(['me', 'settings', 'onboarding']),
  };
}

export default connect(mapStateToProps, {
})(HOCOnboarding);
