import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fromJS } from 'immutable'
import { modal, workflows, overlays } from '../../actions'
import { bindAll } from '../../classes/utils'

import WorkflowList from '../../components/start-goal/WorkflowList'

class StartGoal extends Component {
  constructor(props) {
    super(props)
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
  return {
    workflows: state.get('workflows')
  }
}

const ConnectedStartGoal = connect(mapStateToProps, {
  loadModal: modal.load,
  pushOverlay: overlays.push
})(StartGoal)
export default ConnectedStartGoal
