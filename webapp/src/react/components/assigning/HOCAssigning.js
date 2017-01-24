import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import { List } from 'immutable';
import * as actions from 'actions';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { setupDelegate } from 'classes/utils';
import Assigning from './Assigning';

class HOCAssigning extends Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.clickedAssignee = this.clickedAssignee.bind(this);

    this.callDelegate = setupDelegate(props.delegate);
  }
  clickedAssignee(e) {
    const { index } = this.props;
    this.callDelegate('clickedAssign', e, index);
  }
  render() {
    const {
      stateAssignees,
      me,
    } = this.props;
    return (
      <Assigning me={me} assignees={stateAssignees} onClick={this.clickedAssignee} />
    );
  }
}

function mapStateToProps(state, ownProps) {
  const users = state.get('users');
  const { goalId, stepId, assignees } = ownProps;
  let stateAssignees = List(assignees);
  if (goalId) {
    stateAssignees = state.getIn(['goals', goalId, 'steps', stepId, 'assignees']);
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
};

export default connect(mapStateToProps, {
  stepAssign: actions.goals.stepAssign,
})(HOCAssigning);
