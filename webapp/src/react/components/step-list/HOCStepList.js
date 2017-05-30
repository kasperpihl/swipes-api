import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate, setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import { map } from 'react-immutable-proptypes';
import StepList from './StepList';

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    const helper = this.getHelper();
    this.state = {
      steps: helper.getOrderedSteps(),
    };
    setupLoading(this);
    setupDelegate(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.goal !== this.props.goal) {
      const helper = this.getHelper(nextProps.goal);
      this.setState({ steps: helper.getOrderedSteps() });
    }
  }
  componentDidMount() {
    this.callDelegate('viewDidLoad', this);
  }
  onStepAdd(title) {
    const { addStep, goal } = this.props;
    this.setLoading('add', 'Adding...');
    addStep(goal.get('id'), title).then((res) => {
      this.clearLoading('add');
      if(res.ok){
        window.analytics.sendEvent('Step added', {});
      }
    });
  }
  onStepRemove(i, e) {
    const { confirm, removeStep, goal } = this.props;
    const options = this.getOptionsForE(e);
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);
    confirm(Object.assign({}, options, {
      title: 'Remove step',
      message: 'This can\'t be undone.',
    }), (res) => {
      if (res === 1) {
        this.setLoading(step.get('id'), 'Removing...');
        removeStep(goal.get('id'), step.get('id')).then((res) => {
          this.clearLoading(step.get('id'));
          if(res.ok){
            window.analytics.sendEvent('Step removed', {});
          }
        });
        // remove step
      }
    });
  }
  onStepRename(i, title) {
    const { goal, renameStep } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);
    if(this.getLoading(step.get('id')).loading){
      return;
    }
    this.setLoading(step.get('id'), 'Renaming...');
    renameStep(goal.get('id'), step.get('id'), title).then((res) => {
      this.clearLoading(step.get('id'));
      if(res.ok){
        window.analytics.sendEvent('Step renamed', {});
      }
    });
  }
  onAssign(i, e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees, assignStep, goal } = this.props;
    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);

    options.actionLabel = 'Assign';
    if(step.get('assignees').size){
      options.actionLabel = 'Reassign';
    }
    let overrideAssignees;
    selectAssignees(options, step.get('assignees').toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
      } else if (overrideAssignees) {
        const clearCB = this.clearLoading.bind(null, step.get('id'));
        this.setLoading(step.get('id'), 'Assigning...');
        assignStep(goal.get('id'), step.get('id'), overrideAssignees).then((res) => {
          clearCB();
          if(res.ok){
            window.analytics.sendEvent('Step assigned', {
              'Number of assignees': overrideAssignees.length,
            });
          }
        });
      }
    });
    e.stopPropagation();
  }
  onStepSort({oldIndex, newIndex}, e) {
    if(oldIndex === newIndex){
      return;
    }
    const { reorder } = this.props;
    const helper = this.getHelper();
    const stepOrder = helper.getStepOrder();
    const newStepOrder = helper.getNewStepOrder(oldIndex, newIndex);
    const max = (oldIndex > newIndex) ? oldIndex : newIndex;
    const min = (oldIndex < newIndex) ? oldIndex : newIndex;

    this.setLoading(stepOrder.get(oldIndex), 'Reordering');
    for(let i = min ; i <= max ; i++) {
      //this.setLoading(stepOrder.get(i), 'Reordering...');
      this.setState({ tempOrder: newStepOrder });
    }
    reorder(helper.getId(), newStepOrder).then((res) => {
      console.log('ressy', res);
      this.setState({tempOrder: null});
      for(let i = min ; i <= max ; i++) {
        this.clearLoading(stepOrder.get(i));
      }
    });
  }
  onStepCheck(i, e) {
    const { completeStep, uncompleteStep, goal } = this.props;
    const helper = this.getHelper();

    const step = helper.getStepByIndex(i);
    const actionEvent = step.get('completed') ? 'Step uncompleted' : 'Step completed';
    const actionLabel = step.get('completed') ? 'Uncompleting...' : 'Completing...';
    const actionFunc = step.get('completed') ? uncompleteStep : completeStep;

    this.setLoading(step.get('id'), actionLabel);
    actionFunc(goal.get('id'), step.get('id')).then((res) => {
      if (res && res.ok) {
        this.clearLoading(step.get('id'));
        window.analytics.sendEvent(actionEvent, {});
      } else {
        this.clearLoading(step.get('id'), '!Something went wrong', 3000);
      }
    });

  }
  getHelper(overrideGoal) {
    const { goal, myId } = this.props;
    overrideGoal = overrideGoal || goal;
    return new GoalsUtil(overrideGoal, myId);
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
    };
  }
  render() {
    const {
      tooltip,
      editMode,
      goal,
    } = this.props;
    const { steps, tempOrder } = this.state;

    return (
      <StepList
        {...this.bindLoading()}
        steps={goal.get('steps')}
        stepOrder={tempOrder || goal.get('step_order')}
        delegate={this}
        tooltip={tooltip}
        editMode={editMode}
      />
    );
  }
}

export default connect((state, oP) => ({
  goal: state.getIn(['goals', oP.goalId]),
  myId: state.getIn(['me', 'id']),
}), {
  tooltip: a.main.tooltip,
  addStep: ca.steps.add,
  selectAssignees: a.goals.selectAssignees,
  reorder: ca.steps.reorder,
  completeStep: ca.goals.completeStep,
  uncompleteStep: ca.goals.uncompleteStep,
  confirm: a.menus.confirm,
  removeStep: ca.steps.remove,
  renameStep: ca.steps.rename,
  assignStep: ca.steps.assign,
})(HOCStepList);

const { string, object, func, bool } = PropTypes;

HOCStepList.propTypes = {
  goal: map,
  completeStep: func,
  addStep: func,
  renameStep: func,
  removeStep: func,
  confirm: func,
  myId: string,
  editMode: bool,
  tooltip: func,
  delegate: object,
  selectAssignees: func,
  assignStep: func,
};
