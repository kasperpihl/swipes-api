import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Organization from './Organization';

class HOCOrganization extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  onInvite(firstName, email, e) {
    console.log(firstName, email, e);
  }
  render() {
    const { users, organization } = this.props;

    console.log('users', users.toJS(), organization.toJS());
    return (
      <Organization
        delegate={this}
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
})(HOCOrganization);
