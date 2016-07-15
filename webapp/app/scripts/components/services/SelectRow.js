import React, { Component, PropTypes } from 'react'
const SelectField = require('material-ui/lib/SelectField');
const MenuItem = require('material-ui/lib/menus/menu-item');
console.log('mater', MenuItem);

const getAuthorizeURL = function(serviceName){
	return swipesApi.getAPIURL() + 'services.authorize?service=' + serviceName;
};

class SelectRow extends Component {
  constructor(props) {
    super(props)
    this.state = { value: null }
    _.bindAll(this, 'clickedAuthorize', 'handleChange')
  }
  clickedAuthorize() {
    const serviceName = this.props.data.service_name;
    const url = getAuthorizeURL(serviceName);
    const {ipcRenderer} = nodeRequire('electron');

    ipcRenderer.send('oauth-init', {
      serviceName: serviceName,
      url: url
    });
  }
  handleChange(event, index, value){
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
    let items = this.props.data.services.map(function(service, i){
      return <MenuItem value={i} key={i} primaryText={service.show_name}/>
    });
    items = items.concat(<MenuItem value={this.props.data.services.length} key={"-1"} primaryText="Add New Account"/>);

    return (
      <SelectField floatingLabelStyle={{color: '#666D82'}} floatingLabelText="Select Account..." value={this.state.value} onChange={this.handleChange}>
        {items}
      </SelectField>
    );
  }
  render(){
    let text, src

    if (!this.props.data.services || !this.props.data.services.length) {
      text = 'Connect to ' + this.props.data.title;
      src = 'styles/img/swipes-workspace-illustrations-emptystate-connect.svg'
    } else {
      text = 'Pick a team'
      src = 'styles/img/swipes-workspace-illustrations-emptystate-pickteam.svg'
    }
    return(
      <div className="row connect in-card">
        <img src={src} />
        <h6>{text}</h6>
        <p></p>
        {this.renderSelector()}
      </div>
    );
  }
}
export default SelectRow
