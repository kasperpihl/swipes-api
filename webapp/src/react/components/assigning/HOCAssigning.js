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
  let users = List(ownProps.assignees);
  const myId = state.getIn(['me', 'id']);
  if(users.contains(myId)){
    users = users.filter(uId => uId !== myId).insert(0, myId);
  }
  users = users.map((aId) => state.getIn(['users', aId]));

  return {
    users,
  };
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
