import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
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
      rounded,
      size,
    } = this.props;

    return (
      <Assigning
        maxImages={maxImages}
        assignees={stateAssignees}
        onClick={this.onClick(index)}
        rounded={rounded}
        size={size}
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
  const me = state.get('me');
  if (stateAssignees.includes(me.get('id'))) {
    stateAssignees = stateAssignees.filter(uId => uId !== me.get('id')).insert(0, me.get('id'));
  }
  stateAssignees = stateAssignees.map(uID => users.get(uID)).filter(u => !!u);


  return {
    stateAssignees,
  };
}

const { object, oneOfType, number, string, bool } = PropTypes;
HOCAssigning.propTypes = {
  stateAssignees: list,
  index: oneOfType([number, string]),
  delegate: object,
  maxImages: number,
  rounded: bool,
  size: number,
};

export default connect(mapStateToProps, {
  stepAssign: actions.goals.stepAssign,
})(HOCAssigning);
