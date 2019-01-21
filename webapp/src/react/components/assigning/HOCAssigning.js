import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';

import Assigning from './Assigning';

@connect(
  state => ({
    myId: state.me.get('user_id'),
    organization: state.organization
  }),
  {
    tooltip: mainActions.tooltip,
    selectAssignees: menuActions.selectAssignees
  }
)
export default class HOCAssigning extends PureComponent {
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
    return null;

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
