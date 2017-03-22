import React, { PureComponent, PropTypes } from 'react';
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
    this.state = {
      stateAssignees: this.getStateAssignees(props),
    };
    this.callDelegate = setupDelegate(props.delegate);
    this.onClick = setupCachedCallback(this.callDelegate.bind(null, 'clickedAssign'), this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.assignees !== this.props.assignees) {
      this.setState({ stateAssignees: this.getStateAssignees(nextProps) });
    }
  }
  getStateAssignees(props) {
    const { users, me, goal, stepId, assignees } = props;
    let stateAssignees = List([]);

    if (goal && stepId) {
      stateAssignees = goal.getIn(['steps', stepId, 'assignees']);

      if (!stateAssignees) {
        const helper = new GoalsUtil(goal);
        stateAssignees = List(helper.getAllInvolvedAssignees());
      }
    } else if (assignees && !stateAssignees.size) {
      stateAssignees = List(assignees);
    }

    if (stateAssignees.includes(me.get('id'))) {
      stateAssignees = stateAssignees.filter(uId => uId !== me.get('id')).insert(0, me.get('id'));
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
      tooltipAlign,
    } = this.props;
    const { stateAssignees } = this.state;

    return (
      <Assigning
        maxImages={maxImages}
        assignees={stateAssignees}
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
    goal: state.getIn(['goals', ownProps.goalId]),
    users: state.get('users'),
    me: state.get('me'),
  };
}

const { object, oneOfType, number, string, bool, array, func } = PropTypes;

HOCAssigning.propTypes = {
  tooltip: func,
  goal: map,
  me: map,
  users: map,
  assignees: oneOfType([list, array]),
  stepId: string,
  index: oneOfType([number, string]),
  delegate: object,
  maxImages: number,
  rounded: bool,
  size: number,
};

export default connect(mapStateToProps, {
  tooltip: actions.main.tooltip,
})(HOCAssigning);
