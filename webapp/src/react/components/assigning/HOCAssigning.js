import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import * as mainActions from 'src/redux/main/mainActions';
import { setupDelegate } from 'react-delegate';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import Assigning from './Assigning';

class HOCAssigning extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { users: this.getUsersFromAssignees(props.users, props.assignees) };
    setupDelegate(this, 'onAssign');
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ users: this.getUsersFromAssignees(nextProps.users, nextProps.assignees) });
  }
  getUsersFromAssignees(users, assignees) {
    const { myId } = this.props;
    let filteredUsers = List(assignees);
    if (filteredUsers.contains(myId)) {
      filteredUsers = filteredUsers.filter(uId => uId !== myId).insert(0, myId);
    }
    filteredUsers = filteredUsers.map(aId => users.get(aId)).filter(v => !!v);

    return filteredUsers;
  }
  render() {
    const {
      maxImages,
      index,
      rounded,
      tooltip,
      size,
      tooltipAlign,
    } = this.props;
    const { users } = this.state;

    return (
      <Assigning
        maxImages={maxImages}
        assignees={users}
        onClick={this.onAssignCached(index)}
        rounded={rounded}
        tooltip={tooltip}
        size={size}
        tooltipAlign={tooltipAlign}
      />
    );
  }
}

export default connect(state => ({
  myId: state.getIn(['me', 'id']),
  users: state.get('users'),
}), {
  tooltip: mainActions.tooltip,
})(HOCAssigning);
