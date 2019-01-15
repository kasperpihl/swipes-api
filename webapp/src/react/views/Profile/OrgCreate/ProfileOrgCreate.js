import React, { PureComponent } from 'react';
import SW from './ProfileOrgCreate.swiss';
import Button from 'src/react/components/button/Button';
import request from 'swipes-core-js/utils/request';

export default class ProfileOrgCreate extends PureComponent {
  state = {
    name: ''
  };
  handleChange = e => this.setState({ name: e.target.value });
  handleStartTrial = () => {
    request('organization.add', {
      name: this.state.name
    });
  };
  render() {
    return (
      <SW.Wrapper>
        Create Organization
        <input
          type="text"
          value={this.state.name}
          onChange={this.handleChange}
          placeholder="Name of organization"
          autoFocus
        />
        This will start a trial for 30 days, after which it will be
        $7.5/user/month
        <Button title="Start trial" onClick={this.handleStartTrial} />
      </SW.Wrapper>
    );
  }
}
