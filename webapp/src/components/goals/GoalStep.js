import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

// Views
import Assigning from '../assigning/Assigning'
import StepHeader from './StepHeader'
import StepField from './StepField'
import StepSubmission from './StepSubmission'

import * as gUtils from './goals_utils'
// fields
import * as fields from '../fields'
// styles
import './styles/goal-step.scss'

class GoalStep extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stepIndex: props.initialStepIndex,
      step: props.goal.getIn(['steps', props.initialStepIndex])
    }
    this.setDataForStep();
    this.onSubmit = this.onSubmit.bind(this);
    this.bindCallbacks = {};

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  setDataForStep(){
    const { goal, myId } = this.props;
    const { step, stepIndex } = this.state;
    this.formData = gUtils.getDataForStepIndex(goal, stepIndex, myId);
  }
  delegateFromField(id, name){
    const { step } = this.state;
    const field = step.getIn(['fields', id]);

    if(name === 'change'){
      this.formData = this.formData.set(id, arguments[2]);
    }

    if (name === 'fullscreen') {
      const options = { fullscreen: true };

      this.callDelegate('stepAction', name, {
        component: 'Field',
        title: field.get('title') + ' (Note)',
        props: {
          field,
          options,
          delegate: this.bindCallbacks[id],
          settings: field.get('settings'),
          data: this.formData.get(id)
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
    const { step } = this.state;
    let previousSteps;

    if (goBack) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }

    this.callDelegate('stepSubmit', goal.get('id'), step.get('id'), this.formData, previousSteps);
  }

  renderHeader() {
    const { step, stepIndex } = this.state;
    const stepTitle = step.get('title');
    const assignees = step.get('assignees').toJS();

    return <StepHeader index={stepIndex + 1} title={stepTitle} assignees={assignees}/>
  }
  renderStatus(){
    const {  goal, myId } = this.props;
    const {  stepIndex } = this.state;
    const status = gUtils.getStatusForStepWithIndex(goal, stepIndex, myId);
    return <div className="goal-step__status">{status}</div>
    // You need to fill this form. Submit here
    // Waiting for (${person} || 'people') to fill this form
    // You submitted this form.
    // You submitted this form. Waiting

  }

  renderHandoff(){
    const {  goal, users } = this.props;
    const { stepIndex } = this.state;
    const handOff = gUtils.getHandoffMessageForStepIndex(goal, stepIndex);
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
    return step.get('fields').map((field, i) => {
      const Field = fields[field.get('type')];
      if (Field) {

        const options = {
          fullscreen: false
        }

        if (!this.bindCallbacks[i]) {
          this.bindCallbacks[i] = this.delegateFromField.bind(this, i);
        }
        const icon = Field.getIcon && Field.getIcon() || 'CheckmarkIcon';
        return (
          <StepField key={field.get('id')} title={field.get('title')} icon={icon}>
            <Field
              delegate={this.bindCallbacks[i]}
              options={options}
              data={this.formData.get(i)}
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

    const { goal, myId } = this.props;
    const { stepIndex, step } = this.state;
    const isMine = step.get('assignees').find((a) => (a.get('id') === myId));

    if (isMine && stepIndex === goal.get('currentStepIndex')) {
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
