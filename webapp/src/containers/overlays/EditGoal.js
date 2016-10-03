import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal } from '../../actions'
import { bindAll } from '../../classes/utils'
import { workflows } from '../../actions'
import WorkflowSetup from '../../components/edit-goal/WorkflowSetup'
import { AssignIcon } from '../../components/icons'
class EditGoal extends Component {
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
      list: {
        selectable: true,
        items: userArray
      },
      buttons: ["Cancel", "Select"]
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

const ConnectedEditGoal = connect(mapStateToProps, {
  loadModal: modal.load
})(EditGoal)
export default ConnectedEditGoal
