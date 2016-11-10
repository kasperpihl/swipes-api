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
  }
  componentDidMount() {

  }
  renderHeader(){
    const { step } = this.props;
  }
  renderFields(){
    const { step } = this.props;
    return step.get('fields').map((field, i) => {
      const Field = fields[field.get('type')];
      if(Field){
        let data = {};
        if(field.get('initialData')){
          data = field.get('initialData').toJS();
        }
        return <Field key={'field-'+i} id={step.get('id')} data={data} settings={field.get('settings')} />
      }
    });
  }
  renderSubmission(){

  }
  render() {
    return (
      <div className="goal-step">
        <div className="goal-step__scroller">
          {this.renderHeader()}
          {this.renderFields()}
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
