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
  }
  render() {
    return (
      <Onboarding
        items={[
          { id: 'create-account', title: 'Create account', completed: true },
          { id: 'personalize-swipes', title: 'Personalize Swipes', subtitle: 'Make Swipes your own with profile image and more info for your colleagues'},
          { id: 'create-goals', title: 'Create 3 goals' },
        ]}
      />
    );
  }
}
// const { string } = PropTypes;

HOCOnboarding.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCOnboarding);
