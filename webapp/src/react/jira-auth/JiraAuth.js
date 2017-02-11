import React, { Component, PropTypes } from 'react';
import FloatingInput from 'components/swipes-ui/FloatingInput';
import Button from 'Button';

import './styles/jira-auth.scss';

class JiraAuth extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, error: null };
    this.onClick = this.onClick.bind(this);
  }
  onClick() {
    this.setState({ loading: true, error: null });
    setTimeout(() => {
      this.setState({
        loading: false,
        error: 'Did not work. Tisho need to implement it!',
      });
    }, 500);
  }
  render() {
    const {
      loading,
      error,
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
            ref="url"
          />
          <FloatingInput
            label="Email"
            type="email"
            id="email"
            ref="email"
          />
          <FloatingInput
            label="Password"
            type="password"
            id="password"
            ref="password"
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
