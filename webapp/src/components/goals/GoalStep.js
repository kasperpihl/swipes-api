import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

// Views
import Assigning from '../assigning/Assigning'
import StepHeader from './StepHeader'
import StepField from './StepField'
import StepSubmission from './StepSubmission'
import ProgressBar from '../swipes-ui/ProgressBar'

import GoalsUtil from './goals_util'
// styles
import './styles/goal-step.scss'

class GoalStep extends Component {
  constructor(props) {
    super(props)
    this.helper = new GoalsUtil(props.goal, props.myId);
    this.state = {
      stepIndex: props.initialStepIndex,
      step: props.goal.getIn(['steps', props.initialStepIndex]),
      formData: this.getInitialDataForStepIndex(props.initialStepIndex)
    }

    this.onSubmit = this.onSubmit.bind(this);
    this.bindCallbacks = {};

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  getInitialDataForStepIndex(stepIndex){
    return this.helper.getInitialDataForStepIndex(stepIndex);
  }
  delegateFromField(index, name){
    const { step, formData } = this.state;
    const field = step.getIn(['fields', index]);

    if(name === 'change'){
      this.setState({formData: formData.set(index, arguments[2])});
    }

    if (name === 'fullscreen') {
      const options = { fullscreen: true };

      this.callDelegate('stepAction', name, {
        component: 'Field',
        title: field.get('title') + ' (Note)',
        props: {
          field,
          options,
          delegate: this.bindCallbacks[index],
          settings: field.get('settings'),
          data: formData.get(index)
        }
      });
    }
  }
  callDelegate(name) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === "function") {
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }

  onSubmit(goBack) {
    const { goal } = this.props;
    const { step, formData } = this.state;
    let previousSteps;

    if (goBack) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }

    this.callDelegate('stepSubmit', goal.get('id'), step.get('id'), formData, previousSteps);
  }

  renderHeader() {
    const { step, stepIndex } = this.state;
    const stepTitle = step.get('title');
    const assignees = step.get('assignees').toJS();

    return <StepHeader index={stepIndex + 1} title={stepTitle} assignees={assignees}/>
  }
  renderProgressBar() {
    const { goal } = this.props;

    const steps = goal.get('steps').map( (step) => {
      return { title: step.get('title'), completed: step.get('completed') }
    }).toJS();

    return <ProgressBar steps={steps} currentStepIndex={goal.get('currentStepIndex')}/>
  }
  renderStatus(){
    const { stepIndex } = this.state;
    const status = this.helper.getStatusForStepIndex(stepIndex);

    return <div className="goal-step__status">{status}</div>
    // You need to fill this form. Submit here
    // Waiting for (${person} || 'people') to fill this form
    // You submitted this form.
    // You submitted this form. Waiting
  }
  renderHandoff(){
    const { users } = this.props;
    const { stepIndex } = this.state;
    const handOff = this.helper.getHandoffMessageForStepIndex(stepIndex);
    if(handOff){
      let user, message;
      console.log('handOff', handOff.toJS())
      return;
      return (
        <StepField icon={user.get('profile_pic') || 'PersonIcon'} title={'Handoff from ' + user.get('name')}>
          <div className="goal-step__hand-off-message">{message}</div>
        </StepField>
      )

    }
  }
  renderFields(step){
    const { formData } = this.state;
    return step.get('fields').map((field, i) => {
      const Field = this.helper.fieldForType(field.get('type'));
      if (Field) {
        const options = {
          fullscreen: false
        }

        if (!this.bindCallbacks[i]) {
          this.bindCallbacks[i] = this.delegateFromField.bind(this, i);
        }
        return (
          <StepField key={field.get('id')} title={field.get('title')} icon={Field.icon()}>
            <Field
              delegate={this.bindCallbacks[i]}
              options={options}
              data={formData.get(i)}
              settings={field.get('settings')}
            />
          </StepField>
        )
      }
    });
  }
  renderPreAutomations(){
    // Here will come the pre automations
    // > Send email
    // > Save to Evernote
  }
  renderSubmission(){
    const { stepIndex, step } = this.state;
    const amIAssigned = this.helper.amIAssigned(stepIndex);
    const isCurrent = this.helper.isCurrentStep(stepIndex);

    if (amIAssigned && isCurrent) {
      return <StepSubmission onSubmit={this.onSubmit} submission={step.get('submission')} />
    }
  }
  renderPostAutomations(){
    // Here will come the post automations
    // > Send email
    // > Save to Evernote
  }
  render() {
    const { step, stepIndex } = this.state;
    const { slideDirection } = this.state;

    return (
      <div className="goal-step">

        <div className="goal-step__content">
          {this.renderHeader()}
          {this.renderProgressBar()}
          {this.renderHandoff()}
          {this.renderFields(step)}
        </div>

        <div className="goal-step__side-column">
          {this.renderStatus()}
          {this.renderPreAutomations()}
          {this.renderSubmission()}
          {this.renderPostAutomations()}
        </div>
      </div>
    )
  }
}

export default GoalStep

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

GoalStep.propTypes = {
  goal: map,
  step: map,
  users: map,
  myId: string
}
