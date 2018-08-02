import React, { PureComponent } from 'react';
import loadPage from 'src/react/pages/load';
import { setupLoading, getURLParameter } from 'swipes-core-js/classes/utils';
import FloatingFormInput from 'src/react/views/account/organization/FloatingFormInput.js';
import apiRequest from 'swipes-core-js/utils/apiRequest';
import Icon from 'Icon';
import SW from './Reset.swiss';
// import './styles/reset.scss';

class Reset extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      newPass: '',
    }
    setupLoading(this);
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
  onKeyDown = (e) => {
    if(e.keyCode === 13) {
      this.onReset();
    }
  }
  onReset = () => {
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
  onChange = (key, e) => {
    this.setState({newPass: e.target.value});
  }
  renderLoading() {
    if(!this.isLoading('verify')){
      return undefined;
    }
    return (
      <SW.Loading className="loading">Loading</SW.Loading>
    )
  }
  renderForm() {
    const success = this.getLoading('reset').success;
    if(this.isLoading('verify') || success){
      return undefined;
    }
    return (
      <SW.Form className="form">
        <SW.FormTitle>Reset password Swipes Workspace</SW.FormTitle>
        {this.renderInputField()}
        {this.renderButton()}
      </SW.Form>
    )
  }
  renderInputField() {
    const { newPass } = this.state;

    return (
      <FloatingFormInput
        comp="resetPassword"
        type="password"
        label="Your new password"
        delegate={this}
        value={newPass}
        onChange={this.onChange}
        inputKey="password"
        props={{
          onKeyDown: this.onKeyDown,
        }}
      />
    );
  }
  renderButton() {

    return (
      <SW.Button className="button" ref="button" onClick={this.onReset}>
        {
          this.isLoading('reset') ? (
            <Icon icon="loader" width="12" height="12" />
          ) : (
            'Reset'
          )
        }
      </SW.Button>
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
      <SW.Wrapper className="reset">
        {this.renderLoading()}
        {this.renderForm()}
        {this.renderSuccess()}
      </SW.Wrapper>
    )
  }
}

loadPage(Reset);
