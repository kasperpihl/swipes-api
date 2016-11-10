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
    this.bindCallbacks = {};
  }
  componentDidMount() {

  }
  renderHeader(){
    const { step } = this.props;
  }
  onFieldChange(id, data){
    console.log(id, data);
  }
  renderField(field, id){
    const Field = fields[field.get('type')];
    if(Field){
      let data = {};
      if(field.get('initialData')){
        data = field.get('initialData').toJS();
      }
      const key = 'field-' + id;
      if(!this.bindCallbacks[id]){
        this.bindCallbacks[id] = this.onFieldChange.bind(this, id);
      }
      return (
        <Field
          key={key}
          onChange={this.bindCallbacks[id]}
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
      return this.renderField(field, step.get('id') +i);

    });
  }
  onSubmit(submission){

  }
  renderSubmission(){

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
