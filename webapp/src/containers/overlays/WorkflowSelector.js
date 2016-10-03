import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal } from '../../actions'
import { bindAll } from '../../classes/utils'
import { workflows } from '../../actions'
import WorkflowList from '../../components/workflow-selector/WorkflowList'
import WorkflowSetup from '../../components/workflow-selector/WorkflowSetup'
import { AssignIcon } from '../../components/icons'
class WorkflowSelector extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    bindAll( this, ['didSelectItem', 'didPressUseProcess']);
  }
  didSelectItem(i){
    console.log('selected item', i);
    if(i !== this.state.selectedItem){
      this.setState({ selectedItem: i });
    }
  }
  setupStepPressedAssign(setup, e, i){
    var userArray = [];
    const icon = {
      element: AssignIcon,
      props: {fill: '#3394FF'}
    }
    for( var key in this.props.users ){
      var user = this.props.users[key];
      userArray.push(user);
    }
    this.props.loadModal({
      list: {
        selectable: true,
        items: userArray.map((item) => {
          return {
            title: item.name,
            img: item.profile_pic || icon
          }
        })
      },
      buttons: ["Cancel", "Select"]
    })
  }
  setupSetTitle(setup, title){
    console.log(title);
  }
  setupDidMount(setup, options, name){
    console.log(options, name);
  }
  didPressUseProcess(ref){
    console.log('didPressUseProcess', ref);
  }
  renderSetup(){
    if(this.state.selectedItem){
      const data = this.props.workflows.get(this.state.selectedItem);
      return <WorkflowSetup data={data.toJS()} delegate={this} />
    }
  }
  renderList(){
    if(typeof this.state.selectedItem === 'undefined' || this.state.selectedItem === -1){
      const { workflows } = this.props;
      return <WorkflowList data={workflows.toArray().map((i) => i.toJS())} callback={this.didSelectItem}/>
    }
  }
  render() {
    return (
      <div className="workflow-selector">
        {this.renderList()}
        {this.renderSetup()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    workflows: state.get('workflows'),
    users: state.get('users')
  }
}

const ConnectedWorkflowSelector = connect(mapStateToProps, {
  loadModal: modal.load
})(WorkflowSelector)
export default ConnectedWorkflowSelector
