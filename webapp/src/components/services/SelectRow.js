import React, { Component, PropTypes } from 'react'
import { apiUrl } from '../../actions/api';
import { bindAll } from '../../classes/utils';

import './services.scss'

import Select from 'react-select';

import SwipesWorkspaceIllustrationsEmptystateConnect from './images/swipes-workspace-illustrations-emptystate-connect.svg'
import SwipesWorkspaceIllustrationsEmptystatePickteam from './images/swipes-workspace-illustrations-emptystate-pickteam.svg'

class SelectRow extends Component {
  constructor(props) {
    super(props)
    this.state = { value: null }
    bindAll(this, ['clickedAuthorize', 'handleChange'])
  }
  clickedAuthorize() {
    const serviceName = this.props.data.service_name;
    const url = apiUrl + 'services.authorize?service=' + serviceName;
    const {ipcRenderer} = nodeRequire('electron');

    ipcRenderer.send('oauth-init', {
      serviceName: serviceName,
      url: url
    });
  }
  handleChange(val){
    let value = val.value;
    console.log(value, this.props.data.services);
    if(value === this.props.data.services.length){
      this.clickedAuthorize();
    }
    else{
      var selectedAccount = this.props.data.services[value];
      if(typeof this.props.onSelectedAccount === 'function'){
        this.props.onSelectedAccount(selectedAccount);
      }
    }
  }
  renderSelector(){
    if(!this.props.data.services || !this.props.data.services.length){
      return <div className="services-button" onClick={this.clickedAuthorize}>Connect</div>
    }
    let options = this.props.data.services.map(function(service, i){
      return { value: i, label: service.show_name }
    });
    options.push({ value: this.props.data.services.length, label: 'Add New Account'});
    return (
      <Select
        value={this.state.value}
        options={options}
        onChange={this.handleChange}
      />
    );
  }
  render(){
    let text, SVG

    if (!this.props.data.services || !this.props.data.services.length) {
      text = 'Connect to ' + this.props.data.title;
      SVG = SwipesWorkspaceIllustrationsEmptystateConnect
    } else {
      text = 'Pick a team'
      SVG = SwipesWorkspaceIllustrationsEmptystatePickteam
    }

    return (

      <div className="services-connect">
        <div className="services-connect__illustration">
          <SVG className="services-connect__illustration--svg"/>
        </div>
        <div className="services-connect__title">{text}</div>
        {this.renderSelector()}
      </div>
    );
  }
}
export default SelectRow
