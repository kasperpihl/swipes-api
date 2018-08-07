import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import Assignees from './Assignees';

class HOCAssigning extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      stateAssignees: this.getStateAssignees(props),
    };
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
    const { maxImages } = this.props;
    const { stateAssignees } = this.state;

    return <Assignees maxImages={maxImages} assignees={stateAssignees} />;
  }
}

function mapStateToProps(state, ownProps) {
  return {
    goal: state.goals.get(ownProps.goalId),
    users: state.users,
    me: state.me,
  };
}

export default connect(mapStateToProps, {
})(HOCAssigning);
