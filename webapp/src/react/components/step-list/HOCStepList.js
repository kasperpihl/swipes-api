import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as menuActions from 'src/redux/menu/menuActions';
import * as goalActions from 'src/redux/goal/goalActions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate } from 'react-delegate';
import { setupLoading } from 'swipes-core-js/classes/utils';
import GoalsUtil from 'swipes-core-js/classes/goals-util';
import { map } from 'react-immutable-proptypes';
import StepList from './StepList';

class HOCStepList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    const helper = this.getHelper();
    this.state.steps = helper.getOrderedSteps();

    setupLoading(this);
    setupDelegate(this, 'viewDidLoad', 'onStepDidComplete', 'onAddStepItemInputChange');
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.goal !== this.props.goal) {
      const helper = this.getHelper(nextProps.goal);
      this.setState({ steps: helper.getOrderedSteps() });
    }
  }
  componentDidMount() {
    this.viewDidLoad(this);
  }
  componentWillUnmount() {
    this._unmounted = true;
  }
  onStepAdd(title, assignees) {
    const { addStep, goal } = this.props;
    this.setLoading('add', 'Adding...');
    addStep(goal.get('id'), title, assignees).then((res) => {
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
    if(this.isLoading(step.get('id'))){
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
    let assignees = this.state.addStepAssignees;

    const helper = this.getHelper();
    const step = helper.getStepByIndex(i);
    if(step) {
      assignees = step.get('assignees');
    }

    let overrideAssignees;
    options.onClose = () => {
      if (overrideAssignees) {
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
    }
    selectAssignees(options, assignees.toJS(), (newAssignees) => {
      if (newAssignees) {
        overrideAssignees = newAssignees;
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
    const newStepOrder = helper.getNewStepOrder(oldIndex, newIndex);

    this.setLoading(newStepOrder.get(newIndex), 'Reordering...');
    this.setState({ tempOrder: newStepOrder });

    reorder(helper.getId(), newStepOrder).then((res) => {
      if(!this._unmounted) {
        console.log('ressy', res);
        this.clearLoading(newStepOrder.get(newIndex));
        this.setState({tempOrder: null});
        
      }
    });
  }
  onStepCheck(i, e) {
    console.log('i', i, e);
    const { completeStep, incompleteStep, goal } = this.props;
    const helper = this.getHelper();

    const step = helper.getStepByIndex(i);
    const actionEvent = step.get('completed_at') ? 'Step incompleted' : 'Step completed';
    const actionLabel = step.get('completed_at') ? 'Incompleting...' : 'Completing...';
    const actionFunc = step.get('completed_at') ? incompleteStep : completeStep;

    this.setLoading(step.get('id'), actionLabel);
    actionFunc(goal.get('id'), step.get('id')).then((res) => {
      if (res && res.ok) {
        this.clearLoading(step.get('id'));
        this.onStepDidComplete({
          completed: !step.get('completed_at'),
          stepId: step.get('id'),
        })
        window.analytics.sendEvent(actionEvent, {});
      } else {
        this.clearLoading(step.get('id'), '!Something went wrong', 3000);
      }
    });

  }
  onChangingAdd(title) {
    this.onAddStepItemInputChange(title)
  }
  getHelper(overrideGoal) {
    const { goal, myId } = this.props;
    const { tempOrder } = this.state;

    overrideGoal = overrideGoal || goal;
    if(tempOrder) {
      overrideGoal = overrideGoal.set('step_order', tempOrder);
    }
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
      selectAssignees,
    } = this.props;
    const { steps, tempOrder } = this.state;

    return (
      <StepList
        {...this.bindLoading()}
        steps={goal.get('steps')}
        selectAssignees={selectAssignees}
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
  tooltip: mainActions.tooltip,
  addStep: ca.steps.add,
  selectAssignees: goalActions.selectAssignees,
  reorder: ca.steps.reorder,
  completeStep: ca.goals.completeStep,
  incompleteStep: ca.goals.incompleteStep,
  confirm: menuActions.confirm,
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
