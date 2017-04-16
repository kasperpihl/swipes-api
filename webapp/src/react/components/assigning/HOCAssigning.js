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
    setupDelegate(this);
    this.onClick = setupCachedCallback(this.callDelegate.bind(null, 'onAssign'), this);
  }
  getStateAssignees(props) {
    const { users, myId, goal, stepId, assignees } = props;
    let stateAssignees = List([]);

    if (assignees && !stateAssignees.size) {
      stateAssignees = List(assignees);
    }

    if (stateAssignees.includes(myId)) {
      stateAssignees = stateAssignees.filter(uId => uId !== myId).insert(0, myId);
    }

    stateAssignees = stateAssignees.map(uID => users.get(uID)).filter(u => !!u);

    return stateAssignees;
  }
  render() {
    const {
      maxImages,
      index,
      rounded,
      tooltip,
      size,
      users,
      tooltipAlign,
    } = this.props;
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
  const users = List(ownProps.assignees).map((aId) => state.getIn(['users', aId]));

  return {
    users,
    myId: state.getIn(['me', 'id']),
  };
}

const { object, oneOfType, number, string, bool, array, func } = PropTypes;

HOCAssigning.propTypes = {
  tooltip: func,
  myId: string,
  users: map,
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
