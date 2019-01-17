import React, { PureComponent } from 'react';
import { setupLoading } from 'swipes-core-js/classes/utils';
import SW from './ProfileOrgCreate.swiss';
import request from 'swipes-core-js/utils/request';

export default class ProfileOrgCreate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      name: ''
    };

    setupLoading(this);
  }

  handleChange = e => this.setState({ name: e.target.value });

  handleStartTrial = () => {
    this.setLoading('createOrg');
    request('organization.add', {
      name: this.state.name
    }).then(res => {
      if (res && res.ok) {
        this.clearLoading('createOrg', 'Success', 1500, this.props.hideModal);
      } else {
        this.clearLoading('createOrg', 'Something went wrong!');
      }
    });
  };
  render() {
    return (
      <SW.Wrapper>
        <SW.Title>Create Organization</SW.Title>
        <SW.InputWrapper>
          <SW.InputLabel>Organization name</SW.InputLabel>
          <SW.Input
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
            placeholder="Name of organization"
            autoFocus
          />
        </SW.InputWrapper>
        <SW.Text>
          This will start a trial for 30 days, after which it will be
          $7.5/user/month.
        </SW.Text>
        <SW.Button
          title="Start trial"
          onClick={this.handleStartTrial}
          {...this.getLoading('createOrg')}
        />
      </SW.Wrapper>
    );
  }
}
