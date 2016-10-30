import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindAll } from '../../classes/utils'
import { goals, workspace } from '../../actions';
import { actionForType } from '../../components/goals/actions'

import PureRenderMixin from 'react-addons-pure-render-mixin';

class Step extends Component {
  constructor(props) {
    super(props);
    bindAll(this, [
      'completeStep'
    ]);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  renderActionForStep(){
    const { goal, step } = this.props;

    if(goal && step){
      const View = actionForType(step.get('type'), step.get('subtype'));
      return <View swipes={this.props.swipes} completeStep={this.completeStep} cardDelegate={this} goal={goal} step={step}/>
    }
    return null;
  }
  completeStep(stepId){
    const { goal, completeStep, removeTile } = this.props;
    const goalId = goal.get('id');
    completeStep(goalId, stepId);
    removeTile(stepId);
  }
  render() {
    return (
      <div className='step-tile'>
        {this.renderActionForStep()}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let tile = ownProps.tile;
  let goal, step;
  if(tile){
    const stepId = tile.id;
    const goalId = stepId.split('-')[0];

    goal = state.getIn(['goals', goalId]);
    step = goal.get('steps').find((s) => s.get('id') === stepId)
  }

  return {
    goal: goal,
    step: step
  }
}

const ConnectedStep = connect(mapStateToProps, {
  completeStep: goals.completeStep,
  removeTile: workspace.removeTile
})(Step)
export default ConnectedStep
