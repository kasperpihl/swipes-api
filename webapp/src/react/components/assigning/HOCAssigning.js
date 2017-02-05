import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import { List } from 'immutable';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { setupDelegate, setupCachedCallback } from 'classes/utils';
import GoalsUtil from 'classes/goals-util';
import Assigning from './Assigning';

class HOCAssigning extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.callDelegate = setupDelegate(props.delegate);
    this.onClick = setupCachedCallback(this.callDelegate.bind(null, 'clickedAssign'), this);
  }
  render() {
    const {
      stateAssignees,
      maxImages,
      index,
    } = this.props;

    return (
      <Assigning
        maxImages={maxImages}
        assignees={stateAssignees}
        onClick={this.onClick(index)}
      />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const users = state.get('users');
  const { goalId, stepId, assignees } = ownProps;
  const goal = state.getIn(['goals', goalId]);
  let stateAssignees = state.getIn(['goals', goalId, 'steps', stepId, 'assignees']);
  if (!stateAssignees && goal) {
    const helper = new GoalsUtil(goal);
    stateAssignees = List(helper.getAllInvolvedAssignees());
  } else if (!stateAssignees) {
    stateAssignees = List(assignees);
  }
  stateAssignees = stateAssignees.map(uID => users.get(uID)).filter(u => !!u);
  return {
    stateAssignees,
    me: state.get('me'),
  };
}

const { object, oneOfType, number, string } = PropTypes;
HOCAssigning.propTypes = {
  stateAssignees: list,
  index: oneOfType([number, string]),
  delegate: object,
  me: map,
  maxImages: number,
};

export default connect(mapStateToProps, {
  stepAssign: actions.goals.stepAssign,
})(HOCAssigning);
