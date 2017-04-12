import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import SignupPage from './SignupPage';

class HOCSignupPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const { request } = this.props;
    request('organizations.getUsersFromInvitationToken', {
      invitation_token: window.getURLParameter('invitation_token'),
    }).then((res) => {
      console.log('ressy', res);
    })
    console.log(window.getURLParameter('invitation_token'));
  }
  render() {
    return (
      <SignupPage
      />
    );
  }
}
// const { string } = PropTypes;

HOCSignupPage.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  request: ca.api.request,
})(HOCSignupPage);
