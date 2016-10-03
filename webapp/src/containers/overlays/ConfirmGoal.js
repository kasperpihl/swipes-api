import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal } from '../../actions'
import { bindAll } from '../../classes/utils'
import { workflows } from '../../actions'
import WorkflowSetup from '../../components/confirm-goal/WorkflowSetup'
import { AssignIcon } from '../../components/icons'
class ConfirmGoal extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll( this, [ 'didPressUseProcess']);
  }
  setupStepPressedAssign(setup, e, i){
    const icon = {
      element: AssignIcon,
      props: {fill: '#3394FF'}
    }
    const { users, loadModal } = this.props;
    const userArray = users.toArray().map((u) => { 
      return {
        title: u.get('name'), 
        img: u.get('profile_pic') || icon
      }
    })
    loadModal({
      title: 'Assign Person',
      data: {
        list: {
          selectable: true,
          items: userArray,
          emptyText: 'No people found'
        },
        buttons: ["Cancel", "Select"]
      }
    })
  }
  didPressUseProcess(ref){
    console.log('didPressUseProcess', ref);
  }
  render() {
    const { data } = this.props;
    return <WorkflowSetup data={data} delegate={this} />
  }
}

function mapStateToProps(state) {
  return {
    workflows: state.get('workflows'),
    users: state.get('users')
  }
}

const ConnectedConfirmGoal = connect(mapStateToProps, {
  loadModal: modal.load
})(ConfirmGoal)
export default ConnectedConfirmGoal
