import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

// Views
import Assigning from '../assigning/Assigning'
import StepHeader from './StepHeader'
import StepField from './StepField'
import StepSubmission from './StepSubmission'
// fields
import * as fields from '../fields'
// styles
import './styles/goal-step.scss'

class GoalStep extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.onSubmit = this.onSubmit.bind(this);
    this.bindCallbacks = {};
    this.formData = [];
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  callDelegate(name) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === "function") {
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.stepIndex !== this.props.stepIndex){
      this.formData = [];
    }
  }

  onSubmit(goBack) {
    const { goal, step } = this.props;
    let previousSteps;

    if (goBack) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }

    this.callDelegate('stepSubmit', goal.get('id'), step.get('id'), this.formData, previousSteps);
  }
  onFieldChange(i, data) {
    this.formData[i] = data;
  }

  fieldById(fieldId){
    const { goal } = this.props;
    let field;
    goal.get('steps').forEach((s) => {
      s.get('fields').forEach((f) => {
        if(f.get('id') === fieldId){
          field = f;
        }
      })
    })
    return field;
  }

  renderHeader() {
    const { step, stepIndex } = this.props;
    const stepTitle = step.get('title');
    const assignees = step.get('assignees').toJS();

    return <StepHeader index={stepIndex + 1} title={stepTitle} assignees={assignees}/>
  }
  renderHandoff() {

  }


  renderField(Field, id, title, data, settings) {
    const key = 'field-' + id;

    if (!this.bindCallbacks[id]) {
      this.bindCallbacks[id] = this.onFieldChange.bind(this, id);
    }

    if (typeof this.formData[id] === 'undefined') {
      this.formData[id] = data;
    }

    const icon = Field.getIcon && Field.getIcon() || 'CheckmarkIcon';
    return (

      <StepField key={key} title={title} icon={icon}>
        <Field
          onChange={this.bindCallbacks[id]}
          data={data}
          settings={settings}
        />
      </StepField>
    )
  }
  lastIteration(iterations, belowIndex){
    return iterations.findLast((iter, i) => {
      if(typeof belowIndex !== 'undefined' && i >= belowIndex){
        return false;
      }
      return (iter !== null);
    })
  }
  renderHandoff(){
    const { step, stepIndex, goal, users } = this.props;
    const lastIteration = this.lastIteration(step.get('iterations'));
    if(lastIteration && lastIteration.get('previousStep')){
      const previousStep = goal.get('steps').find((s) => s.get('id') === lastIteration.get('previousStep'));
      if(previousStep){
        const prevIteration = this.lastIteration(previousStep.get('iterations'))
        if(prevIteration && prevIteration.get('responses').size){

          let user, message;
          prevIteration.get('responses').forEach((response, userId) => {
            user = users.get(userId);
            message = response.get('message');
            return false;

          })
          console.log('message', message, user);
          if(user && message && message.length){
              return (
              <StepField icon={user.get('profile_pic') || 'PersonIcon'} title={'Handoff from ' + user.get('name')}>
                <div className="goal-step__hand-off-message">{message}</div>
              </StepField>
            )
          }
        }
      }
    }
  }
  renderFields(step){
    const { myId } = this.props;

    return step.get('fields').map((field, i) => {
      if(field.get('type') === 'link'){
        const target = field.getIn(['settings', 'target']);
        if(target && target.get('type') === 'field'){
          field = this.fieldById(target.get('id')) || field;
        }
      }

      let data = {};
      const lastValue = step.get('iterations').findLast((val, k) => {
        return (k !== step.get('iterations').size-1 && val)
      })

      if (lastValue && lastValue.getIn(['responses', myId, 'data', i ])) {
        data = lastValue.getIn(['responses', myId, 'data', i ]).toJS();
      } else if(field.get('initial_data')) {
        data = field.get('initial_data').toJS();
      }

      const Field = fields[field.get('type')];

      if (Field) {
        return this.renderField(Field, i, field.get('title'), data, field.get('settings'));
      }
    });
  }

  renderPreAutomations(){

  }
  renderStatus(){
    const { step } = this.props;
    // You need to fill this form. Submit here
    // Waiting for (${person} || 'people') to fill this form
    // You submitted this form.
    // You submitted this form. Waiting

  }
  renderSubmission(){
    const { stepIndex, step, goal } = this.props;
    if(stepIndex === goal.get('currentStepIndex')){
      return <StepSubmission onSubmit={this.onSubmit} submission={step.get('submission')} />
    }
  }
  renderPostAutomations(){

  }
  render() {
    const { step } = this.props;

    return (
      <div className="goal-step">
        <div className="goal-step__scroller">
          {this.renderHeader()}
          {this.renderHandoff()}
          {this.renderFields(step)}
        </div>
        <div className="goal-step__status">
          {this.renderPreAutomations()}
          {this.renderStatus()}
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
