import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fromJS } from 'immutable'
import { modal, workflows, overlays } from '../../actions'
import { bindAll } from '../../classes/utils'

import WorkflowList from '../../components/start-goal/WorkflowList'

class StartGoal extends Component {
  constructor(props) {
    super(props)
    console.log(props.workflows);
    this.state = {}
    bindAll( this, ['didSelectItem']);
  }
  didSelectItem(id){
    const { pushOverlay, workflows } = this.props;
    pushOverlay({component: "ConfirmGoal", title: "Confirm", props: {data: workflows.get(id).toJS()}});
  }
  renderList(){
    const { workflows } = this.props;
    return <WorkflowList data={workflows.toArray().map((i) => i.toJS())} callback={this.didSelectItem} />
  }
  render() {
    return (
      <div className="start-goal">
        {this.renderList()}
      </div>
    )
    
  }
}

function mapStateToProps(state) {

  let workflows = state.get('workflows').updateIn(['PGR5OHKL6'], (wf) => {
    wf = wf.set('title', 'Design workflow').set('img', 'http://publicdomainvectors.org/photos/Raseone-Record.png').set('description', 'The Swipes simple design workflow, just enough structure to deliver great quality.. Always');
    console.log(wf.get('steps').toJS())
    wf = wf.updateIn(['steps'], (steps) => {
      steps = steps.updateIn([0], (step) => step.set('title', 'Upload designs').set('description', 'Hello desc ffs'));
      return steps.push(fromJS({
        type: 'decide',
        subtype: 'decision',
        title: 'Select Design',
        assignees: []
      }))
    })
    return wf;
  })
  //const wf = workflows.get('PGR5OHKL6')
  //workflows = workflows.set('PGR5OHKL5', wf).set('PGR5OHKL4', wf).set('PGR5OHKL3', wf);
  return {
    workflows: workflows
  }
}

const ConnectedStartGoal = connect(mapStateToProps, {
  loadModal: modal.load,
  pushOverlay: overlays.push
})(StartGoal)
export default ConnectedStartGoal
