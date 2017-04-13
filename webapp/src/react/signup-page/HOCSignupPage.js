import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS, Map } from 'immutable';
import SignupPage from './SignupPage';

class HOCSignupPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: Map(),
      invitationToken: window.getURLParameter('invitation_token'),
    };
    setupLoading(this);
  }
  componentDidMount() {
    const { request } = this.props;
    const { formData, invitationToken } = this.state;

    request('organizations.getInfoFromInvitationToken', {
      invitation_token: invitationToken,
    }).then((res) => {
      if(res && res.ok){
        const me = fromJS(res.me);
        const firstName = msgGen.users.getFirstName(me);
        const email = msgGen.users.getEmail(me);
        this.setState({
          users: res.users,
          organization: fromJS(res.organization),
          me,
          formData: formData.set('email', email).set('firstName', firstName),
        });
      }

      console.log('ressy', res);
    })
    console.log(window.getURLParameter('invitation_token'));
  }
  onChange(key, e) {
    const { formData } = this.state;
    this.setState({formData: formData.set(key, e.target.value)});
  }
  onClick() {
    console.log('clicky!');
    const { formData, invitationToken } = this.state;
    const { signup } = this.props;
    signup({
      first_name: formData.get('firstName'),
      last_name: formData.get('lastName'),
      email: formData.get('email'),
      password: formData.get('password'),
      invitation_token: invitationToken,
    }).then((res) => {
      console.log('ressy', res);
    });
  }
  render() {
    const { formData } = this.state;

    return (
      <SignupPage
        formData={formData}
        delegate={this}
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
  signup: ca.users.signup,
})(HOCSignupPage);
