import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import * as mainActions from 'src/redux/main/mainActions';
import * as goalActions from 'src/redux/goal/goalActions';
import { setupDelegate } from 'react-delegate';
import getParentByClass from 'swipes-core-js/utils/getParentByClass';


import Assigning from './Assigning2';

class HOCAssigning extends PureComponent {
  constructor(props) {
    super(props);
    const assignees = List(props.assignees);
    this.state = {
      assignees,
      filteredUsers: this.getUsersFromAssignees(props.users, assignees)
    };
    setupDelegate(this, 'onAssigningClose')
  }
  componentWillReceiveProps(nextProps) {
    const assignees = List(nextProps.assignees);
    this.setState({
      assignees,
      filteredUsers: this.getUsersFromAssignees(nextProps.users, assignees),
    });
  }
  getUsersFromAssignees(users, assignees) {
    const { myId } = this.props;
    let filteredUsers = assignees;
    if (filteredUsers.contains(myId)) {
      filteredUsers = filteredUsers.filter(uId => uId !== myId).insert(0, myId);
    }
    filteredUsers = filteredUsers.map(aId => users.get(aId)).filter(v => !!v);

    return filteredUsers;
  }

  onClick = (e) => {
    const { enableSelect, selectAssignees } = this.props;
    if(!enableSelect) {
      return;
    }
    const { assignees } = this.state;
    
    let overrideAssignees;
    const options = {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      onClose: () => {
        this.onAssigningClose(List(overrideAssignees));
      },
    };
    selectAssignees(options, assignees.toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      }
    });
    e.stopPropagation();
  }
  render() {
    const {
      maxImages,
      index,
      size,
      tooltipAlign,
      tooltip,
    } = this.props;
    const { filteredUsers } = this.state;

    return (
      <Assigning
        maxImages={maxImages || 1}
        assignees={filteredUsers}
        onClick={this.onClick}
        size={size||24}
        tooltipAlign={tooltipAlign}
        tooltip={tooltip}
      />
    );
  }
}

export default connect(state => ({
  myId: state.getIn(['me', 'id']),
  users: state.get('users'),
}), {
  tooltip: mainActions.tooltip,
  selectAssignees: goalActions.selectAssignees,
})(HOCAssigning);
