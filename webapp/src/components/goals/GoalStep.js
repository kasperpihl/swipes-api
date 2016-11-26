import React, { Component, PropTypes } from 'react'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'
import { Map, fromJS } from 'immutable'

// Views
import Assigning from '../assigning/Assigning'
import StepHeader from './StepHeader'
import StepField from './StepField'
import StepSubmission from './StepSubmission'
import ProgressBar from '../swipes-ui/ProgressBar'

import GoalsUtil from './goals_util'
import { throttle, bindAll } from '../../classes/utils'

// styles
import './styles/goal-step.scss'

class GoalStep extends Component {
  constructor(props) {
    super(props)
    this.helper = new GoalsUtil(props.goal, props.myId, props.cache);
    this.state = {
      stepIndex: props.initialStepIndex,
      step: this.helper.getStepByIndex(props.initialStepIndex),
      formData: this.helper.getInitialDataForStepIndex(props.initialStepIndex)
    }

    bindAll(this, ['onSubmit', 'cacheFormInput', 'onProgressChange']);
    this.bindCallbacks = {};
    this.throttledCache = throttle(this.cacheFormInput, 5000)

    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  updateToStepIndex(i){
    const { stepIndex } = this.state;
    if(i !== stepIndex){
      const step = this.helper.getStepByIndex(i);
      const formData = this.helper.getInitialDataForStepIndex(i)
      this.setState({
        stepIndex: i,
        step,
        formData
      })
    }

  }
  cacheFormInput(){
    const { stepIndex } = this.state;
    const data = {
      stepIndex: this.helper.currentStepIndex(),
      runCounter: this.helper.runCounter()
    };
    const amIAssigned = this.helper.amIAssigned(stepIndex);
    const isCurrent = this.helper.isCurrentStep(stepIndex);
    if(amIAssigned && isCurrent){
      data.data = this.generateRawObj()
    }
    this.callDelegate('stepCache', fromJS(data));
  }
  generateRawObj(){
    const { formData, step } = this.state;
    return step.get('fields').map((field, i) => {
      if(field.get('type') === 'link'){
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
  componentWillReceiveProps(nextProps){
    const { goal } = this.props;
    const { stepIndex } = this.state;
    const nextGoal = nextProps.goal;

    if(goal !== nextGoal){
      this.helper.updateGoal(nextGoal);
      if(stepIndex === goal.get('currentStepIndex')){
        if(goal.get('currentStepIndex') !== nextGoal.get('currentStepIndex')){
          this.updateToStepIndex(nextGoal.get('currentStepIndex'))
        }
      }

    }
  }
  componentDidMount(){
    window.addEventListener("beforeunload", this.cacheFormInput);
  }
  componentWillUnmount(){
    this.cacheFormInput();
    window.removeEventListener("beforeunload", this.cacheFormInput);
  }
  fullscreenForFieldIndex(index){
    const { step, formData, stepIndex } = this.state;
    const { helper } = this;
    let field = step.getIn(['fields', index]);

    if(this.isFullscreen){
      this.callDelegate('stepAction', 'popOverlay');
    }
    else{
      const fieldAndSettings = helper.getFieldAndSettingsFromField(field, stepIndex, {fullscreen: true});
      this.isFullscreen = true;
      this.callDelegate('stepAction', 'fullscreen', {
        component: 'Field',
        title: field.get('title') + ' (Note)',
        onClose: () => {
          this.isFullscreen = false;
          this.cacheFormInput()
        },
        props: {
          index,
          field: fieldAndSettings[0],
          delegate: this.bindCallbacks[index],
          settings: fieldAndSettings[1],
          data: formData.get(index)
        }
      });
    }


  }
  delegateFromField(index, name){
    const { step, formData, stepIndex } = this.state;


    if(name === 'change'){
      this.setState({formData: formData.set(index, arguments[2])});
      this.throttledCache();
    }

    if (name === 'fullscreen') {
      this.fullscreenForFieldIndex(index);
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
    const data = this.generateRawObj();
    this.callDelegate('stepSubmit', goal.get('id'), step.get('id'), data, previousSteps);
  }

  renderHeader() {
    const { step, stepIndex } = this.state;
    const stepTitle = step.get('title');
    const assignees = step.get('assignees').toJS();

    return (
      <StepHeader
        index={stepIndex + 1}
        title={stepTitle}
        assignees={assignees}
      />
    )
  }
  onProgressChange(i){
    this.updateToStepIndex(i);
  }
  renderProgressBar() {
    const { goal } = this.props;
    const { stepIndex } = this.state;
    const runCounter = this.helper.runCounter();
    const steps = goal.get('steps').map( (step, i) => {
      return {
        title: step.get('title')
        // disabled: (i > goal.get('currentStepIndex'))
      }
    }).toJS();

    return (
      <ProgressBar
        steps={steps}
        title={'run ' + runCounter}
        onChange={this.onProgressChange}
        activeIndex={stepIndex}
        currentIndex={goal.get('currentStepIndex')}
      />
    )
  }
  renderStatus(){
    const { stepIndex } = this.state;
    const status = this.helper.getStatusForStepIndex(stepIndex);

    return <div className="goal-step__status">{status}</div>
  }
  renderHandoff(){
    const { users } = this.props;
    const { stepIndex } = this.state;
    const handOff = this.helper.getHandoffMessageForStepIndex(stepIndex);
    if(handOff){
      let user, message;
      const firstMessage = handOff.findEntry(() => true);
      if(!firstMessage){
        return;
      }
      user = users.get(firstMessage[0])
      message = firstMessage[1];
      if(user && message && message.length){
        return (
          <StepField
            icon={user.get('profile_pic') || 'PersonIcon'}
            title={'Handoff from ' + user.get('name')}>
            <div className="goal-step__hand-off-message">{message}</div>
          </StepField>
        )
      }


    }
  }


  renderFields(step){
    const { goal } = this.props;
    const { helper } = this;
    const { formData, stepIndex } = this.state;
    return step.get('fields').map((field, i) => {

      const iconAndColor = helper.getIconWithColorForField(field, stepIndex);
      // Field-swap for links. Check if field is a link and find the link
      const fAndS = helper.getFieldAndSettingsFromField(field, stepIndex);
      field = fAndS[0];
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
            key={field.get('id')}
            title={field.get('title')}
            icon={iconAndColor[0]}
            iconColor={iconAndColor[1]}>
            <Field
              delegate={this.bindCallbacks[i]}
              data={formData.get(i)}
              settings={settings}
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
    const { helper } = this;
    const { step, stepIndex } = this.state;
    const { slideDirection } = this.state;
    let sideColumnClass = 'goal-step__side-column'
    if(helper.isCurrentStep(stepIndex) && helper.amIAssigned(stepIndex)){
      sideColumnClass += ' goal-step__side-column--active'
    }

    return (
      <div className="goal-step">

        <div className="goal-step__content">
          {this.renderHeader()}
          {this.renderProgressBar()}
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
