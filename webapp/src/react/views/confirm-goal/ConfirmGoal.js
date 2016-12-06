import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { modal, api, overlay, toasty } from '../../actions';
import { bindAll } from '../../classes/utils';
import WorkflowSetup from '../../components/confirm-goal/WorkflowSetup';

class ConfirmGoal extends Component {
  constructor(props) {
    super(props);
    this.state = { workflow: props.data };
    bindAll(this, ['didPressStart', 'selectedAssignees']);
  }

  setupStepPressedAssign(setup, e, i) {
    const icon = {
      element: 'PersonIcon',
      props: { fill: '#3394FF' },
    };
    const { users, loadModal } = this.props;
    const { workflow } = this.state;
    const userArray = users.toArray().map(u => ({
      title: u.get('name'),
      img: u.get('profile_pic') || icon,
      selected: (workflow.getIn(['steps', i, 'assignees']).contains(u.get('id'))),
    }));

    loadModal({
      title: 'Assign Person',
      data: {
        list: {
          selectable: true,
          multiple: true,
          items: userArray,
          emptyText: 'No people found',
        },
        buttons: ['Cancel', 'Select'],
      },
    }, this.selectedAssignees.bind(this, i));
  }
  selectedAssignees(i, res) {
    const { workflow } = this.state;
    const { users } = this.props;

    if (res && res.items.length) {
      const newWorkflow = workflow.updateIn(['steps', i, 'assignees'], (assignees) => {
        let newAssignees = assignees;

        res.items.forEach((u) => {
          const user = users.toArray()[u];

          if (!newAssignees.contains(user.get('id'))) {
            newAssignees = newAssignees.push(user.get('id'));
          }
        });

        return newAssignees;
      });

      this.setState({ workflow: newWorkflow });
    }
  }
  didUpdateTitle(ref, title) {
    this.goalTitle = title;
  }
  didPressStart() {
    const { request, organization_id, clearOverlay, addToasty, updateToasty } = this.props;
    const { workflow } = this.state;
    const goal = workflow.toJS();
    const workflowId = goal.id;

    if (this.goalTitle) {
      goal.title = this.goalTitle;
    }

    delete goal.id;
    clearOverlay();

    addToasty({ title: `Adding: ${this.goalTitle}`, loading: true }).then((toastId) => {
      request('goals.create', { workflowId, organization_id, goal }).then((res) => {
        if (res.ok) {
          updateToasty(toastId, { title: `Added: ${this.goalTitle}`, completed: true, duration: 3000 });
          clearOverlay();
        } else {
          updateToasty(toastId, { title: 'Error adding goal', loading: false, duration: 3000 });
        }
      });
    });
  }
  parseWorkflow() {
    const { workflow } = this.state;
    const { users } = this.props;

    return workflow.updateIn(['steps'], s => s.map((step) => {
      const assignees = step.get('assignees');

      return step.set('assignees', assignees.map(userId => users.get(userId)));
    })).toJS();
  }
  render() {
    const workflow = this.parseWorkflow();

    return <WorkflowSetup data={workflow} delegate={this} />;
  }
}

const { string, func } = PropTypes;

ConfirmGoal.propTypes = {
  data: map,
  users: map,
  loadModal: func,
  request: func,
  organization_id: string,
  clearOverlay: func,
  addToasty: func,
  updateToasty: func,
};

function mapStateToProps(state) {
  return {
    organization_id: state.getIn(['me', 'organizations', 0, 'id']),
    users: state.get('users'),
  };
}

const ConnectedConfirmGoal = connect(mapStateToProps, {
  loadModal: modal.load,
  clearOverlay: overlay.clear,
  request: api.request,
  addToasty: toasty.add,
  updateToasty: toasty.update,
})(ConfirmGoal);

export default ConnectedConfirmGoal;
