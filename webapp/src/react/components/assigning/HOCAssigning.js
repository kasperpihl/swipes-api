import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Assigning from './Assigning';

class HOCAssigning extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedAssignee = this.clickedAssignee.bind(this);
  }
  clickedAssignee() {
    const {
      goalId,
      stepIndex,
      stepAssign,
    } = this.props;
    stepAssign(goalId, stepIndex);
  }
  render() {
    const {
      assignees,
      me,
    } = this.props;
    return (
      <Assigning me={me} assignees={assignees} onClick={this.clickedAssignee} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const users = state.get('users');

  const { goalId, stepIndex } = ownProps;
  const step = state.getIn(['goals', goalId, 'steps', stepIndex]);
  const assignees = step.get('assignees').map(userId => users.get(userId));

  return {
    assignees,
    me: state.get('me'),
  };
}

const { string, number, func } = PropTypes;
HOCAssigning.propTypes = {
  assignees: list.isRequired,
  stepAssign: func,
  goalId: string.isRequired,
  stepIndex: number.isRequired,
  me: map,
};

export default connect(mapStateToProps, {
  stepAssign: actions.goals.stepAssign,
})(HOCAssigning);
