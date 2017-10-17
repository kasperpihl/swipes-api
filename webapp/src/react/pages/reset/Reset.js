import React, { PureComponent } from 'react';
import loadPage from 'src/react/pages/load';
import { apiRequest, bindAll, setupLoading, getURLParameter } from 'swipes-core-js/classes/utils';
import FloatingInput from 'src/react/browser-compatible/components/input/FloatingInput';
import Icon from 'Icon';

import './styles/reset.scss';

class Reset extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      newPass: '',
    }
    setupLoading(this);
    bindAll(this, ['onReset', 'onChange', 'onKeyDown']);
  }
  componentWillMount() {
    this.setLoading('verify');
    apiRequest('me.verifyResetToken', {
      token: getURLParameter('token')
    }).then((res) => {
      if(res && res.ok) {
        this.clearLoading('verify');
      } else {
        this.clearLoading('verify',);
        this.clearLoading('reset', 'This token is no longer valid');
      }
    })
  }
  onKeyDown(e){
    if(e.keyCode === 13) {
      this.onReset();
    }
  }
  onReset() {
    const { newPass } = this.state;
    if(!newPass.length) {
      return;
    }
    this.setLoading('reset');
    apiRequest('me.resetPassword', {
      token: getURLParameter('token'),
      password: newPass,
    }).then((res) => {
      if(res && res.ok) {
        this.clearLoading('reset', 'Your password has been reset. Try login again now.');
      } else {
        this.clearLoading('reset', 'Something went wrong');
      }
      console.log(res);
    })
  }
  onChange(key, e) {
    this.setState({newPass: e.target.value});
  }
  renderLoading() {
    if(!this.isLoading('verify')){
      return undefined;
    }
    return (
      <div className="loading">Loading</div>
    )
  }
  renderForm() {
    const success = this.getLoading('reset').success;
    if(this.isLoading('verify') || success){
      return undefined;
    }
    return (
      <div className="form">
        <h6>Reset password Swipes Workspace</h6>
        {this.renderInputField()}
        {this.renderButton()}
      </div>
    )
  }
  renderInputField() {
    const { newPass } = this.state;

    return (
      <FloatingInput
        type="password"
        placeholder="Your new password"
        delegate={this}
        value={newPass}
        inputKey="password"
        props={{
          onKeyDown: this.onKeyDown,
          autoFocus: true,
        }}
      />
    );
  }
  renderButton() {

    return (
      <div className="button" ref="button" onClick={this.onReset}>
        {
          this.isLoading('reset') ? (
            <Icon icon="loader" width="12" height="12" />
          ) : (
            'Reset'
          )
        }
      </div>
    )
  }
  renderSuccess() {
    const success = this.getLoading('reset').success;
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
        {this.renderForm()}
        {this.renderSuccess()}
      </div>
    )
  }
}

loadPage(Reset);
