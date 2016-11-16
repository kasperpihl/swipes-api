import React, { Component, PropTypes } from 'react'
import * as Icons from '../icons'
import PureRenderMixin from 'react-addons-pure-render-mixin';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup'

// Views
import Assigning from '../assigning/Assigning'
import StepHeader from './StepHeader'
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
  componentDidMount() {

  }
  renderHeader() {
    const { step, stepIndex } = this.props;
    const stepTitle = step.get('title');
    const assignees = step.get('assignees').toJS();

    return <StepHeader index={stepIndex + 1} title={stepTitle} assignees={assignees}/>
  }
  renderHandoff() {

  }
  onFieldChange(i, data) {
    this.formData[i] = data;
  }
  renderIcon(icon) {
    const Comp = Icons[icon];

    if (Comp) {
      return <Comp className="goal-step__icon goal-step__icon--svg"/>;
    }
  }
  renderField(Field, id, title, data, settings) {
    const key = 'field-' + id;

    if (!this.bindCallbacks[id]) {
      this.bindCallbacks[id] = this.onFieldChange.bind(this, id);
    }

    if (typeof this.formData[id] === 'undefined') {
      this.formData[id] = data;
    }

    return (
      <div className="goal-step__field" key={key}>
        <div className="goal-step__field-header">
          {this.renderIcon(Field.getIcon && Field.getIcon() || 'CheckmarkIcon')}
          {title}
        </div>
        <Field
          onChange={this.bindCallbacks[id]}
          data={data}
          settings={settings}
        />
      </div>
    )
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
  onSubmit(goBack) {
    const { goal, step } = this.props;
    let previousSteps;

    if (goBack) {
      previousSteps = goal.get('steps').slice(0, goal.get('currentStepIndex'));
    }

    this.callDelegate('stepSubmit', goal.get('id'), step.get('id'), this.formData, previousSteps);
  }
  renderPreAutomations(){

  }
  renderStatus(){
    const { step } = this.props;
  }
  renderSubmission(){
    const { step } = this.props;

    return <StepSubmission onSubmit={this.onSubmit} submission={step.get('submission')} />
  }
  renderPostAutomations(){

  }
  render() {
    const { step } = this.props;

    return (
      <ReactCSSTransitionGroup
        transitionName="goal-step-intro-transition"
        component="div"
        className="goal-step"
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}>
        <div className="goal-step__scroller">
          {this.renderHeader()}
          {this.renderFields(step)}
        </div>
        <div className="goal-step__submission">
          {this.renderPreAutomations()}
          {this.renderSubmission()}
          {this.renderPostAutomations()}
        </div>
      </ReactCSSTransitionGroup>
    )
  }
}

export default GoalStep

const { string } = PropTypes;
import { map, mapContains, list, listOf } from 'react-immutable-proptypes'

GoalStep.propTypes = {
  goal: map,
  step: map,
  myId: string
}
