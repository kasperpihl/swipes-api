import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal, api, overlay, toasty } from '../../actions'
import { bindAll } from '../../classes/utils'
import { workflows } from '../../actions'
import WorkflowSetup from '../../components/confirm-goal/WorkflowSetup'
import { AssignIcon } from '../../components/icons'
class ConfirmGoal extends Component {
  constructor(props) {
    super(props)
    this.state = { workflow: props.data }
    bindAll( this, [ 'didPressStart', 'selectedAssignees']);
  }

  setupStepPressedAssign(setup, e, i){
    const icon = {
      element: AssignIcon,
      props: {fill: '#3394FF'}
    }
    const { users, loadModal } = this.props;
    const { workflow } = this.state;
    const userArray = users.toArray().map((u) => {
      return {
        title: u.get('name'),
        img: u.get('profile_pic') || icon,
        selected: (workflow.getIn(['steps', i, 'assignees', u.get('id')]))
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
    }, this.selectedAssignees.bind(this, i))
  }
  selectedAssignees(i, res){
    const { workflow } = this.state;
    const { users } = this.props;
    if(res && res.items.length){
      let newWorkflow = workflow.updateIn(['steps', i, 'assignees'], (assignees) => {
        res.items.forEach((u) => {
          const user = users.toArray()[u];
          if(!assignees.contains(user.get('id'))){
            assignees = assignees.push(user.get('id'));
          }
        })
        return assignees;
      })
      this.setState({workflow: newWorkflow});
    }
  }
  didUpdateTitle(ref, title){
    this.goalTitle = title;
  }
  didPressStart(ref){
    const { addToasty, updateToasty, removeToasty } = this.props;
    addToasty({title: "Adding goal", loading: true}).then((toastId) => {
      setTimeout(() => {
        updateToasty(toastId, { loading: false, title: 'Added goal' });
      }, 3000);
      setTimeout(() => {
        removeToasty(toastId);
      }, 4500);
    });

    return;
    const { request, organization_id, clearOverlay } = this.props;
    const { workflow } = this.state;
    const goal = workflow.toJS();
    const workflow_id = goal.id;
    delete goal.id;
    console.log(workflow.toJS());
    request('goals.add', {process_id: workflow_id, organization_id, goal }).then((res) => {
      if(res.ok){
        clearOverlay();
      }
      console.log(res);
    })
  }
  parseWorkflow(){
    const { workflow } = this.state;
    const { users } = this.props;
    return workflow.updateIn(['steps'], (s) => s.map((step) => {
      const assignees = step.get('assignees');
      return step.set('assignees', assignees.map((userId) => {
        return users.get(userId);
      }));
    })).toJS();
  }
  render() {
    const workflow = this.parseWorkflow()
    return <WorkflowSetup data={workflow} delegate={this} />
  }
}

function mapStateToProps(state) {
  return {
    organization_id: state.getIn(['me', 'organizations', 0, 'id']),
    users: state.get('users')
  }
}

const ConnectedConfirmGoal = connect(mapStateToProps, {
  loadModal: modal.load,
  clearOverlay: overlay.clear,
  request: api.request,
  addToasty: toasty.add,
  updateToasty: toasty.update,
  removeToasty: toasty.remove
})(ConfirmGoal)
export default ConnectedConfirmGoal
