import React, { Component, PropTypes } from 'react';
import { apiUrl } from 'actions/api';
import { bindAll } from 'classes/utils';

import './services.scss';

import Select from 'react-select';

import SwipesWorkspaceIllustrationsEmptystateConnect from './images/swipes-workspace-illustrations-emptystate-connect.svg';
import SwipesWorkspaceIllustrationsEmptystatePickteam from './images/swipes-workspace-illustrations-emptystate-pickteam.svg';

class SelectRow extends Component {
  constructor(props) {
    super(props);
    this.state = { value: null };
    bindAll(this, ['clickedAuthorize', 'handleChange']);
  }
  clickedAuthorize() {
    const serviceName = this.props.data.service_name;
    const url = `${apiUrl}services.authorize?service_name=${serviceName}`;

    window.ipcListener.sendEvent('oauth-init', {
      serviceName,
      url,
    });
  }
  handleChange(val) {
    const value = val.value;
    const { services } = this.props.data;
    if (value === services.size) {
      this.clickedAuthorize();
    } else {
      const selectedAccount = services.get(value);
      if (typeof this.props.onSelectedAccount === 'function') {
        this.props.onSelectedAccount(selectedAccount);
      }
    }
  }
  renderSelector() {
    const services = this.props.data.services;
    if (!services || !services.size) {
      return <div className="services-connect__button" onClick={this.clickedAuthorize}>Connect</div>;
    }
    let options = services.map((service, i) => ({ value: i, label: service.get('show_name') }));
    options = options.push({ value: services.size, label: 'Add New Account' });
    return (
      <Select
        value={this.state.value}
        options={options.toJS()}
        onChange={this.handleChange}
      />
    );
  }
  render() {
    let text,
      SVG;
    const services = this.props.data.services;
    if (!services || !services.size) {
      text = `Connect to ${this.props.data.title}`;
      SVG = SwipesWorkspaceIllustrationsEmptystateConnect;
    } else {
      text = 'Pick a team';
      SVG = SwipesWorkspaceIllustrationsEmptystatePickteam;
    }

    return (

      <div className="services-connect">
        <div className="services-connect__illustration">
          <SVG className="services-connect__illustration--svg" />
        </div>
        <div className="services-connect__title">{text}</div>
        {this.renderSelector()}
      </div>
    );
  }
}
export default SelectRow;
