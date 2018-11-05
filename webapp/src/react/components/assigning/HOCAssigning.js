import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import { setupDelegate } from 'react-delegate';
import getParentByClass from 'swipes-core-js/utils/getParentByClass';

import Assigning from './Assigning';

@connect(
  state => ({
    myId: state.me.get('id'),
    users: state.users
  }),
  {
    tooltip: mainActions.tooltip,
    selectAssignees: menuActions.selectAssignees
  }
)
export default class HOCAssigning extends PureComponent {
  constructor(props) {
    super(props);
    const assignees = List(props.assignees);
    this.state = {
      assignees,
      filteredUsers: this.getUsersFromAssignees(props.users, assignees)
    };
    setupDelegate(this, 'onAssigningClose');
  }
  componentWillReceiveProps(nextProps) {
    const assignees = List(nextProps.assignees);
    this.setState({
      assignees,
      filteredUsers: this.getUsersFromAssignees(nextProps.users, assignees)
    });
  }
  getUsersFromAssignees(users, assignees) {
    const { myId } = this.props;
    let filteredUsers = assignees;
    if (filteredUsers.contains(myId) || filteredUsers.contains('me')) {
      filteredUsers = filteredUsers
        .filter(uId => uId !== myId && uId !== 'me')
        .insert(0, myId);
    }
    filteredUsers = filteredUsers.map(aId => users.get(aId)).filter(v => !!v);

    return filteredUsers;
  }

  onClick = e => {
    const { delegate, selectAssignees } = this.props;
    if (!delegate) {
      return;
    }
    const { assignees } = this.state;

    let overrideAssignees;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      onClose: () => {
        this.onAssigningClose(overrideAssignees && List(overrideAssignees));
      }
    };
    selectAssignees(options, assignees.toJS(), newAssignees => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      }
    });
    e.stopPropagation();
  };
  render() {
    const { filteredUsers } = this.state;

    return (
      <Assigning
        onClick={this.onClick}
        {...this.props}
        assignees={filteredUsers}
        size={this.props.size || 24}
        maxImages={this.props.maxImages || 1}
      />
    );
  }
}
