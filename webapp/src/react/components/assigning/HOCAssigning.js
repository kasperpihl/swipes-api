import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { map, list } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { List } from 'immutable';
import * as actions from 'actions';
import { setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import Assigning from './Assigning';

class HOCAssigning extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { users: this.getUsersFromAssignees(props.users, props.assignees) };
    setupDelegate(this);
    this.onClick = setupCachedCallback(this.callDelegate.bind(null, 'onAssign'), this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ users: this.getUsersFromAssignees(nextProps.users, nextProps.assignees) });
  }
  getUsersFromAssignees(users, assignees) {
    const { myId } = this.props;
    let filteredUsers = List(assignees);
    if(filteredUsers.contains(myId)){
      filteredUsers = filteredUsers.filter(uId => uId !== myId).insert(0, myId);
    }
    filteredUsers = filteredUsers.map(aId => users.get(aId));

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
    // const { stateAssignees } = this.state;
    return (
      <Assigning
        maxImages={maxImages}
        assignees={users}
        onClick={this.onClick(index)}
        rounded={rounded}
        tooltip={tooltip}
        size={size}
        tooltipAlign={tooltipAlign}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    myId: state.getIn(['me', 'id']),
    users: state.get('users'),
  }
}

const { object, oneOfType, number, string, bool, array, func } = PropTypes;

HOCAssigning.propTypes = {
  tooltip: func,
  myId: string,
  users: list,
  assignees: oneOfType([list, array]).isRequired,
  index: oneOfType([number, string]),
  delegate: object,
  maxImages: number,
  rounded: bool,
  size: number,
};

export default connect(mapStateToProps, {
  tooltip: actions.main.tooltip,
})(HOCAssigning);
