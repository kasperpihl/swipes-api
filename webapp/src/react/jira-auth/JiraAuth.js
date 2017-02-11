import React, { Component, PropTypes } from 'react';
import FloatingInput from 'components/swipes-ui/FloatingInput';
import Button from 'Button';
import { setupCachedCallback, bindAll } from 'classes/utils';

import './styles/jira-auth.scss';

class JiraAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      url: '',
      email: '',
      password: '',
    };
    bindAll(this, ['onClick', 'onKeyDown']);
    this.cachedOnChange = setupCachedCallback(this.onChange, this);
  }
  onClick() {
    this.setState({ loading: true, error: null });
    setTimeout(() => {
      const {
        url,
        password,
        email,
      } = this.state;

      if (true) {
        // Success
        const res = {
          url,
          password,
          email,
        };
        const query = this.serializeQuery(res);
        // console.log(query);
        document.location.href = `${document.location.origin}/oauth-success.html?${query}`;
      } else {
        // error
        this.setState({
          loading: false,
          error: 'Did not work. Tisho need to implement it!',
        });
      }
    }, 500);
  }
  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.onClick();
    }
  }
  onChange(key, value) {
    if (this.state.loading) {
      return;
    }
    this.setState({ [key]: value });
  }
  redirect() {

  }
  serializeQuery(obj) {
    const str = [];
    Object.entries(obj).forEach(([key, value]) => {
      str.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    });
    return str.join('&');
  }
  render() {
    const {
      loading,
      error,
      url,
      email,
      password,
    } = this.state;

    let errorClass = 'jira-auth__error';

    if (error) {
      errorClass += ' jira-auth__error--show';
    }

    return (
      <div className="jira-auth">
        <div className="jira-auth__title">
          Authorize JIRA!
        </div>
        <div className="jira-auth__form">
          <FloatingInput
            label="Jira url"
            type="url"
            id="url"
            value={url}
            onKeyDown={this.onKeyDown}
            onChange={this.cachedOnChange('url')}
          />
          <FloatingInput
            label="Email"
            type="email"
            id="email"
            value={email}
            onKeyDown={this.onKeyDown}
            onChange={this.cachedOnChange('email')}
          />
          <FloatingInput
            label="Password"
            type="password"
            id="password"
            value={password}
            onKeyDown={this.onKeyDown}
            onChange={this.cachedOnChange('password')}
          />
          <div className={errorClass}>{error}</div>
        </div>
        <div className="jira-auth__actions">
          <Button
            primary
            text="Authorize Jira"
            onClick={this.onClick}
            loading={loading}
            className="jira-auth__button"
          />
        </div>
      </div>
    );
  }
}

export default JiraAuth;

const { string } = PropTypes;

JiraAuth.propTypes = {
  // removeThis: string.isRequired,
};
