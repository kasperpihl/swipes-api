import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { fromJS } from 'immutable'
import { modal, workflows, overlay } from '../../actions'
import { bindAll } from '../../classes/utils'

import WorkflowList from '../../components/start-goal/WorkflowList'
import Button from '../../components/swipes-ui/Button'

class StartGoal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll( this, ['didSelectItem', 'clickedStore']);
  }
  didSelectItem(id){
    const { pushOverlay, workflows } = this.props;
    pushOverlay({component: "ConfirmGoal", title: "Confirm", props: {data: workflows.get(id).toJS()}});
  }
  renderList(){
    const { workflows } = this.props;
    return <WorkflowList data={workflows.toArray().map((i) => i.toJS())} callback={this.didSelectItem} />
  }
  clickedStore(){
    const { pushOverlay } = this.props;
    pushOverlay({component: "Store", title: "Store"});
  }
  render() {
    return (
      <div className="start-goal" style={{height: '100%'}}>
        {this.renderList()}
        <Button callback={this.clickedStore} title="Go to store" style={{position: 'fixed', bottom: '60px', right: '30px'}}/>
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
  pushOverlay: overlay.push
})(StartGoal)
export default ConnectedStartGoal
