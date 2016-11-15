import React, { Component, PropTypes } from 'react'


// Views
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
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentDidMount() {

  }
  renderHeader(){
    const { step } = this.props;
  }
  onFieldChange(i, data){
    console.log(i, data);
    this.formData[i] = data;
  }
  renderField(field, i){
    const Field = fields[field.get('type')];
    if(Field){
      let data = {};
      if(field.get('initialData')){
        data = field.get('initialData').toJS();
      }
      const key = 'field-' + i;
      if(!this.bindCallbacks[i]){
        this.bindCallbacks[i] = this.onFieldChange.bind(this, i);
      }
      if(typeof this.formData[i] === 'undefined'){
        this.formData[i] = data;
      }
      return (
        <Field
          key={key}
          onChange={this.bindCallbacks[i]}
          data={data}
          settings={field.get('settings')}
        />
      )
    }
  }
  renderFields(step){
    return step.get('fields').map((field, i) => {
      if(field.get('type') === 'link'){

      }
      return this.renderField(field, i);
    });
  }
  onSubmit(goBack){
    const { goal, step } = this.props;
    let previousSteps;
    if(!goBack){
      console.log('sending orev');
      previousSteps = goal.get('steps');
    }
    this.callDelegate('stepSubmit', goal.get('id'), step.get('id'), this.formData, previousSteps);
    console.log(this.formData);
  }
  renderSubmission(){
    const { step } = this.props;
    return <StepSubmission onSubmit={this.onSubmit} submission={step.get('submission')} />
  }
  render() {
    const { step } = this.props;
    return (
      <div className="goal-step">
        <div className="goal-step__scroller">
          {this.renderHeader()}
          {this.renderFields(step)}
        </div>
        <div className="goal-step__submission">
          {this.renderSubmission()}
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
  step: map
}
