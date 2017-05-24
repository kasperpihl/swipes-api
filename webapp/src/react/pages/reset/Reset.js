import React, { PureComponent } from 'react';
import loadPage from 'src/react/pages/load';
import { apiRequest, bindAll } from 'swipes-core-js/classes/utils';

import './styles/reset.scss';

class Reset extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      newPass: '',
    }
    bindAll(this, ['onReset', 'onChange']);
  }
  componentWillMount() {
    apiRequest('me.verifyResetToken', {
      token: getURLParameter('token')
    }).then((res) => {
      if(res && res.ok) {
        this.setState({
          loading: false,
        });
      } else {
        this.setState({
          error: 'This token is no longer valid',
          loading: false,
        })
      }
      console.log(res);
    })
  }
  onReset() {
    const { newPass } = this.state;
    apiRequest('me.resetPassword', {
      token: getURLParameter('token'),
      password: newPass,
    }).then((res) => {
      if(res && res.ok) {
        this.setState({
          success: 'Your password has been reset. Try login again now.',
        });
      } else {
        this.setState({
          error: 'Something went wrong',
          loading: false,
        })
      }
      console.log(res);
    })
  }
  onChange(e) {
    this.setState({newPass: e.target.value});
  }
  renderLoading() {
    const { loading } = this.state;
    if(!loading){
      return undefined;
    }
    return (
      <div className="loading">Loading</div>
    )
  }
  renderFields() {
    const { loading, error, success, newPass } = this.state;
    if(loading || error || success) {
      return undefined;
    }
    return (
      <div className="fields">
        <input
          placeholder="New password"
          type="password"
          onChange={this.onChange}
          value={newPass}
        />
        <button onClick={this.onReset} disabled={!newPass.length}>
          Reset
        </button>
      </div>
    )
  }
  renderError() {
    const { error } = this.state;
    if(!error) {
      return undefined;
    }
    return (
      <div className="error">{error}</div>
    )
  }
  renderSuccess() {
    const { success } = this.state;
    if(!success) {
      return undefined;
    }
    return (
      <div className="success">{success}</div>
    )
  }

  render() {
    return (
      <div className="reset">
        {this.renderLoading()}
        {this.renderFields()}
        {this.renderError()}
        {this.renderSuccess()}
      </div>
    )
  }
}

loadPage(Reset);
