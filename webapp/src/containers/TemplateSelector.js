import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import { bindAll } from '../classes/utils'
import { templates } from '../actions'
import TemplateList from '../components/template-selector/TemplateList'
import TemplateSetup from '../components/template-selector/TemplateSetup'
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
  setupStepDidPressAssign(setup){

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
    templates: state.templates
  }
}

const ConnectedTemplateSelector = connect(mapStateToProps, {
  
})(TemplateSelector)
export default ConnectedTemplateSelector