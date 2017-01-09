import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import * as actions from 'actions';
import { bindAll } from 'classes/utils';
import WorkflowHeader from './WorkflowHeader';
import WorkflowStepList from './WorkflowStepList';

import './styles/workflow-setup.scss';

class ConfirmGoal extends Component {
  constructor(props) {
    super(props);
    this.state = { workflow: props.data };
    bindAll(this, ['didPressStart', 'selectedAssignees']);
  }

  setupStepPressedAssign(setup, e, i) {
    const { assignModal } = this.props;
    const { workflow } = this.state;
    return assignModal(
      workflow.getIn(['steps', i, 'assignees']),
      this.selectedAssignees.bind(this, i),
    );
  }
  selectedAssignees(i, res) {
    const { workflow } = this.state;
    if (res) {
      const newWorkflow = workflow.setIn(['steps', i, 'assignees'], fromJS(res));
      this.setState({ workflow: newWorkflow });
    }
  }
  didUpdateTitle(ref, title) {
    this.goalTitle = title;
  }
  didPressStart() {
    const { organization_id, addToasty, updateToasty, request } = this.props;
    const { workflow } = this.state;
    const goal = workflow.toJS();
    const workflowId = goal.id;

    if (this.goalTitle) {
      goal.title = this.goalTitle;
    }

    delete goal.id;

    addToasty({ title: `Adding: ${this.goalTitle}`, loading: true }).then((toastId) => {
      request('goals.create', { workflow_id: workflowId, organization_id, goal }).then((res) => {
        if (res.ok) {
          updateToasty(toastId, {
            title: `Added: ${this.goalTitle}`,
            completed: true,
            duration: 3000,
          });
        } else {
          updateToasty(toastId, {
            title: 'Error adding goal',
            loading: false,
            duration: 3000,
          });
        }
      });
    });
  }
  render() {
    const { workflow } = this.state;
    return (
      <div ref="container" className="workflow__setup">
        <WorkflowHeader data={workflow} delegate={this} />
        <WorkflowStepList data={workflow.get('steps')} delegate={this} />
      </div>
    );
  }
}

const { string, func } = PropTypes;

ConfirmGoal.propTypes = {
  data: map,
  assignModal: func,
  addToasty: func,
  updateToasty: func,
  request: func,
  organization_id: string,
};

function mapStateToProps(state) {
  return {
    organization_id: state.getIn(['me', 'organizations', 0, 'id']),
  };
}

const ConnectedConfirmGoal = connect(mapStateToProps, {
  assignModal: actions.modal.assign,
  addToasty: actions.toasty.add,
  updateToasty: actions.toasty.update,
  request: actions.api.request,
})(ConfirmGoal);

export default ConnectedConfirmGoal;
