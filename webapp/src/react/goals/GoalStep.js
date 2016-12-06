import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { fromJS } from 'immutable';
import Icon from 'Icon';

// Views
import StepHeader from './StepHeader';
import StepField from './StepField';
import StepSubmission from './StepSubmission';
import ProgressBar from '../swipes-ui/ProgressBar';

import GoalsUtil from './goals_util';
import { throttle, bindAll } from '../../classes/utils';

// styles
import './styles/goal-step.scss';

class GoalStep extends Component {
  constructor(props) {
    super(props);
    this.helper = new GoalsUtil(props.goal, props.myId, props.cache);
    this.state = {
      stepIndex: props.initialStepIndex,
      step: this.helper.getStepByIndex(props.initialStepIndex),
      formData: this.helper.getInitialDataForStepIndex(props.initialStepIndex),
    };

    bindAll(this, ['onSubmit', 'cacheFormInput', 'onProgressChange']);
    this.bindCallbacks = {};
    this.throttledCache = throttle(this.cacheFormInput, 5000);

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
    window.addEventListener('beforeunload', this.cacheFormInput);
  }
  componentWillReceiveProps(nextProps) {
    const { goal } = this.props;
    const { stepIndex } = this.state;
    const nextGoal = nextProps.goal;

    if (goal !== nextGoal) {
      this.helper.updateGoal(nextGoal);
      if (stepIndex === goal.get('currentStepIndex')) {
        if (goal.get('currentStepIndex') !== nextGoal.get('currentStepIndex')) {
          this.updateToStepIndex(nextGoal.get('currentStepIndex'));
        }
      }
    }
  }
  componentWillUnmount() {
    this.cacheFormInput();
    window.removeEventListener('beforeunload', this.cacheFormInput);
  }
  onSubmit(goBack) {
    const { goal } = this.props;
    const { step } = this.state;
    let previousSteps;

    if (goBack) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }
    const data = this.generateRawObj();
    this.setState({ isSubmitting: true });
    this.callDelegate('stepSubmit', step.get('id'), data, previousSteps, () => {
      this.setState({ isSubmitting: false });
    });
  }
  onProgressChange(i) {
    this.updateToStepIndex(i);
  }
  updateToStepIndex(i) {
    const { stepIndex } = this.state;
    if (i !== stepIndex) {
      const step = this.helper.getStepByIndex(i);
      const formData = this.helper.getInitialDataForStepIndex(i);
      this.setState({
        stepIndex: i,
        step,
        formData,
      });
    }
  }
  cacheFormInput() {
    const { stepIndex } = this.state;
    const data = {
      stepIndex: this.helper.currentStepIndex(),
      runCounter: this.helper.runCounter(),
    };
    const amIAssigned = this.helper.amIAssigned(stepIndex);
    const isCurrent = this.helper.isCurrentStep(stepIndex);
    if (amIAssigned && isCurrent) {
      data.data = this.generateRawObj();
    }
    this.callDelegate('stepCache', fromJS(data));
  }
  generateRawObj() {
    const { formData, step } = this.state;
    return step.get('fields').map((field, i) => {
      if (field.get('type') === 'link') {
        return null;
      }
      const Field = this.helper.fieldForType(field.get('type'));
      let data = formData.get(i);
      if (Field && typeof Field.saveData === 'function') {
        data = Field.saveData(data);
      }
      return data;
    }).toJS();
  }
  fullscreenForFieldIndex(index) {
    const { step, formData, stepIndex } = this.state;
    const { helper } = this;
    const field = step.getIn(['fields', index]);

    if (this.isFullscreen) {
      this.callDelegate('stepAction', 'popOverlay');
    } else {
      const fieldAndSettings =
      helper.getFieldAndSettingsFromField(field, stepIndex, { fullscreen: true });

      this.isFullscreen = true;
      this.callDelegate('stepAction', 'fullscreen', {
        component: 'Field',
        title: `${field.get('title')} (Note)`,
        onClose: () => {
          this.isFullscreen = false;
          this.cacheFormInput();
        },
        props: {
          index,
          field: fieldAndSettings[0],
          delegate: this.bindCallbacks[index],
          settings: fieldAndSettings[1],
          data: formData.get(index),
        },
      });
    }
  }
  delegateFromField(index, name) {
    const { formData } = this.state;


    if (name === 'change') {
      this.setState({ formData: formData.set(index, arguments[2]) });
      this.throttledCache();
    }

    if (name === 'fullscreen') {
      this.fullscreenForFieldIndex(index);
    }
  }
  callDelegate(name) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...[this].concat(Array.prototype.slice.call(arguments, 1)));
    }

    return undefined;
  }
  renderIcon(icon) {
    return <Icon svg={icon} className="goal-step__icon goal-step__icon--svg" />;
  }
  renderHeader() {
    const { myId } = this.props;
    const { step, stepIndex } = this.state;
    const stepTitle = step.get('title');
    const assignees = step.get('assignees').toJS();
    const me = { id: myId };

    return (
      <StepHeader
        index={stepIndex + 1}
        title={stepTitle}
        assignees={assignees}
        me={me}
      />
    );
  }
  renderProgressBar() {
    const { goal } = this.props;
    const { stepIndex } = this.state;
    const runCounter = this.helper.runCounter();
    const steps = goal.get('steps').map(step => ({
      title: step.get('title'),
        // disabled: (i > goal.get('currentStepIndex'))
    })).toJS();

    return (
      <ProgressBar
        steps={steps}
        title={`run ${runCounter}`}
        onChange={this.onProgressChange}
        activeIndex={stepIndex}
        currentIndex={goal.get('currentStepIndex')}
      />
    );
  }
  renderComplete() {
    const { stepIndex } = this.state;

    if (this.helper.isLastStep(stepIndex) && this.helper.isGoalCompleted()) {
      return (
        <div className="goal-step__completed">
          {this.renderIcon('CheckmarkIcon')}
          goal completed
        </div>
      );
    }

    return undefined;
  }
  renderStatus() {
    const { stepIndex } = this.state;
    const status = this.helper.getStatusForStepIndex(stepIndex);

    return <div className="goal-step__status">{status}</div>;
  }
  renderHandoff() {
    const { users } = this.props;
    const { stepIndex } = this.state;
    const handOff = this.helper.getHandoffMessageForStepIndex(stepIndex);

    if (handOff) {
      const firstMessage = handOff.findEntry(() => true);

      if (!firstMessage) {
        return undefined;
      }

      const user = users.get(firstMessage[0]);
      const message = firstMessage[1];

      if (user && message && message.length) {
        return (
          <StepField
            icon={user.get('profile_pic') || 'PersonIcon'}
            title={`Handoff from ${user.get('name')}`}
          >
            <div className="goal-step__hand-off-message">{message}</div>
          </StepField>
        );
      }
    }

    return undefined;
  }
  renderFields(step) {
    const { helper } = this;
    const { formData, stepIndex } = this.state;
    return step.get('fields').map((field, i) => {
      const iconAndColor = helper.getIconWithColorForField(field, stepIndex);
      // Field-swap for links. Check if field is a link and find the link
      const fAndS = helper.getFieldAndSettingsFromField(field, stepIndex);
      let newField = field;
      newField = fAndS[0];
      const settings = fAndS[1];

      const Field = helper.fieldForType(field.get('type'));

      if (Field) {
        const canShowFullscreen = (Field.fullscreen && Field.fullscreen());

        if (!this.bindCallbacks[i]) {
          this.bindCallbacks[i] = this.delegateFromField.bind(this, i);
        }
        return (
          <StepField
            fullscreen={canShowFullscreen}
            delegate={this.bindCallbacks[i]}
            key={newField.get('id')}
            title={newField.get('title')}
            icon={iconAndColor[0]}
            iconColor={iconAndColor[1]}
          >
            <Field
              delegate={this.bindCallbacks[i]}
              data={formData.get(i)}
              settings={settings}
            />
          </StepField>
        );
      }

      return undefined;
    });
  }
  renderPreAutomations() {
    // Here will come the pre automations
    // > Send email
    // > Save to Evernote
  }
  renderSubmission() {
    const { stepIndex, step, isSubmitting } = this.state;
    const amIAssigned = this.helper.amIAssigned(stepIndex);
    const isCurrent = this.helper.isCurrentStep(stepIndex);

    if (amIAssigned && isCurrent) {
      return <StepSubmission onSubmit={this.onSubmit} submission={step.get('submission')} disabled={!!isSubmitting} />;
    }

    return undefined;
  }
  renderPostAutomations() {
    // Here will come the post automations
    // > Send email
    // > Save to Evernote
  }
  render() {
    const { helper } = this;
    const { step, stepIndex } = this.state;
    let sideColumnClass = 'goal-step__side-column';

    if (helper.isCurrentStep(stepIndex) && helper.amIAssigned(stepIndex)) {
      sideColumnClass += ' goal-step__side-column--active';
    }
    // console.log('this.props.goal.toJS()', JSON.stringify(this.props.goal.toJS()));
    return (
      <div className="goal-step">

        <div className="goal-step__content">
          {this.renderHeader()}
          {this.renderProgressBar()}
          {this.renderComplete()}
          {this.renderHandoff()}
          {this.renderFields(step)}
        </div>

        <div className={sideColumnClass}>
          {this.renderStatus()}
          {this.renderPreAutomations()}
          {this.renderSubmission()}
          {this.renderPostAutomations()}
        </div>
      </div>
    );
  }
}

export default GoalStep;

const { string, number, object } = PropTypes;

GoalStep.propTypes = {
  goal: map,
  users: map,
  myId: string,
  cache: map,
  initialStepIndex: number,
  delegate: object,
};
