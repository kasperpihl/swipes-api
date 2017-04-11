import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
// import { map, list } from 'react-immutable-proptypes';
import { setupLoading } from 'swipes-core-js/classes/utils';
// import { fromJS } from 'immutable';
import Organization from './Organization';

class HOCOrganization extends PureComponent {
  static minWidth() {
    return 900;
  }
  constructor(props) {
    super(props);
    setupLoading(this);
  }
  componentDidMount() {
  }
  onInvite(firstName, email, e) {
    console.log(firstName, email, e);
    const { invite } = this.props;
    this.setLoading('invite');
    invite(firstName, email).then((res) => {
      this.clearLoading('invite');
    });
  }
  render() {
    const { users, organization } = this.props;

    return (
      <Organization
        delegate={this}
        loadingState={this.getAllLoading()}
        organization={organization}
        users={users.sort((u1, u2) => u1.get('first_name').localeCompare(u2.get('first_name')))}
      />
    );
  }
}
// const { string } = PropTypes;

HOCOrganization.propTypes = {};

function mapStateToProps(state) {
  return {
    users: state.get('users'),
    organization: state.getIn(['me', 'organizations', 0]),
  };
}

export default connect(mapStateToProps, {
  invite: ca.users.invite,
})(HOCOrganization);
