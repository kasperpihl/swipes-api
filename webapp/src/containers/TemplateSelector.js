import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { modal } from '../actions'
import { bindAll } from '../classes/utils'
import { templates } from '../actions'
import TemplateList from '../components/template-selector/TemplateList'
import TemplateSetup from '../components/template-selector/TemplateSetup'
import { AssignIcon } from '../components/icons'
class TemplateSelector extends Component {
  constructor(props) {
    super(props)
    const data = [];
    for( var key in props.templates){
      data.push(props.templates[key]);
    }
    this.state = {templates: data}
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
    if(typeof this.state.selectedItem !== 'undefined' && this.state.selectedItem > -1){
      const data = this.state.templates[this.state.selectedItem];
      return <TemplateSetup data={data} delegate={this} />
    }
  }
  renderList(){
    if(typeof this.state.selectedItem === 'undefined' || this.state.selectedItem === -1){
      const { templates } = this.state;
      return <TemplateList data={templates} callback={this.didSelectItem}/>
    }
  }
  render() {
    return (
      <div className="template-selector">
        {this.renderList()}
        {this.renderSetup()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    templates: state.templates,
    users: state.users
  }
}

const ConnectedTemplateSelector = connect(mapStateToProps, {
  loadModal: modal.loadModal
})(TemplateSelector)
export default ConnectedTemplateSelector
