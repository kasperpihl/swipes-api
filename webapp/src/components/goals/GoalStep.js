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
    this.state = {
      slideDirection: 'slide-step-left'
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.bindCallbacks = {};
    this.formData = [];
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);

  }
  delegateFromField(id, name){
    const { step } = this.props;
    const field = step.getIn(['fields', id]);
    console.log('field!', field.toJS());
    if(name === 'change'){
      this.formData[id] = arguments[2];
    }
    if(name === 'fullscreen'){

      this.callDelegate('stepAction', name, {
        component: 'Field',
      });
    }
  }
  callDelegate(name) {
    const { delegate } = this.props;

    if (delegate && typeof delegate[name] === "function") {
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.stepIndex !== this.props.stepIndex) {
      this.formData = [];
    }

    if (nextProps.stepIndex < this.props.stepIndex) {
      this.setState({slideDirection: 'slide-step-right'})
    } else if(nextProps > this.props.stepIndex) {
      this.setState({slideDirection: 'slide-step-left'})
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

  stepFieldById(fieldId){
    const { goal } = this.props;
    let field, step;
    goal.get('steps').forEach((s) => {
      s.get('fields').forEach((f) => {
        if(f.get('id') === fieldId){
          field = f;
          step = s;
        }
      })
    })
    if(field){
      return [step, field];
    }
    return;
  }

  renderHeader() {
    const { step, stepIndex } = this.props;
    const stepTitle = step.get('title');
    const assignees = step.get('assignees').toJS();

    return <StepHeader index={stepIndex + 1} title={stepTitle} assignees={assignees}/>
  }
  renderStatus(){
    const { step, stepIndex, goal, myId } = this.props;
    let status;

    const isMine = step.get('assignees').find((a) => (a.get('id') === myId))
    if(step.get('completed')){
      status = 'This step was completed';
    }
    else if(stepIndex === goal.get('currentStepIndex')){
      status = 'Waiting for people to complete this step';
      if(isMine){
        status = 'You need to complete this step';
      }
    }
    else if(stepIndex > goal.get('currentStepIndex')){
      status = 'This step is yet to be completed';
    }
    return <div className="goal-step__status">{status}</div>
    // You need to fill this form. Submit here
    // Waiting for (${person} || 'people') to fill this form
    // You submitted this form.
    // You submitted this form. Waiting

  }
  renderField(Field, id, title, data, settings) {
    const key = 'field-' + id;

    // Make sure the delegate is bound with the field id
    if (!this.bindCallbacks[id]) {
      this.bindCallbacks[id] = this.delegateFromField.bind(this, id);
    }

    if (typeof this.formData[id] === 'undefined') {
      this.formData[id] = data;
    }

    const options = {
      fullscreen: false
    }

    const icon = Field.getIcon && Field.getIcon() || 'CheckmarkIcon';
    return (

      <StepField key={key} title={title} icon={icon}>
        <Field
          delegate={this.bindCallbacks[id]}
          options={options}
          data={data}
          settings={settings}
        />
      </StepField>
    )
  }
  lastIteration(iterations, maxIndex){
    if(!iterations || maxIndex < 0 ){
      return undefined;
    }
    return iterations.findLastEntry((iter, i) => {
      if(typeof maxIndex !== 'undefined' && i > maxIndex){
        return false;
      }
      return (iter !== null);
    })
  }
  renderHandoff(){
    const { step, stepIndex, goal, users } = this.props;
    const lastIteration = this.lastIteration(step.get('iterations'));

    if(lastIteration){
      const previousStepIndex = lastIteration[1].get('previousStepIndex');
      const iterationIndex = lastIteration[0];

      const pIterations = goal.getIn(['steps', previousStepIndex, 'iterations'])
      const pIteration = this.lastIteration(pIterations, iterationIndex);

      if(pIteration){
        let user, message;
        pIteration[1].get('responses').forEach((response, userId) => {
          user = users.get(userId);
          message = response.get('message');
          return false;

        })
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
  renderFields(step){
    const { myId } = this.props;

    return step.get('fields').map((field, i) => {
      let lastIteration = this.lastIteration(step.get('iterations'));
      if(field.get('type') === 'link'){
        const target = field.getIn(['settings', 'target']);
        if(target && target.get('type') === 'field'){
          const stepField = this.stepFieldById(target.get('id'));
          if(stepField){
            field = stepField[1];
            lastIteration = this.lastIteration(stepField[0].get('iterations'), lastIteration ? lastIteration[0] : undefined);
          }
        }
      }

      let data = {};
      if(field.get('initial_data')) {
        data = field.get('initial_data').toJS();
      }

      if(lastIteration){
        const myLastResponseToField = lastIteration[1].getIn(['responses', myId, 'data', i]);
        if(myLastResponseToField){
          data = myLastResponseToField.toJS();
        }
      }

      const Field = fields[field.get('type')];

      if (Field) {
        return this.renderField(Field, i, field.get('title'), data, field.get('settings'));
      }
    });
  }



  renderPreAutomations(){
    // Here will come the pre automations
    // > Send email
    // > Save to Evernote
  }
  renderSubmission(){
    const { stepIndex, step, goal, myId } = this.props;

    const isMine = step.get('assignees').find((a) => (a.get('id') === myId))
    if(isMine && stepIndex === goal.get('currentStepIndex')){
      return <StepSubmission onSubmit={this.onSubmit} submission={step.get('submission')} />
    }
  }
  renderPostAutomations(){
    // Here will come the post automations
    // > Send email
    // > Save to Evernote
  }
  render() {
    const { step, stepIndex } = this.props;
    const { slideDirection } = this.state;

    return (
      <div className="goal-step">
        <ReactCSSTransitionGroup
        transitionName={slideDirection}
        component="div"
        className="goal-step__scroller"
        transitionEnterTimeout={400}
        transitionLeaveTimeout={400}>
          <div className="goal-step__transition-wrapper" key={'step-' + stepIndex}>
            {this.renderHeader()}
            {this.renderStatus()}
            {this.renderHandoff()}
            {this.renderFields(step)}
            {this.renderPreAutomations()}
            {this.renderSubmission()}
            {this.renderPostAutomations()}
          </div>
        </ReactCSSTransitionGroup>
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
