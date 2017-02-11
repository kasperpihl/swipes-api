import React, { Component, PropTypes } from 'react';
import FloatingInput from 'components/swipes-ui/FloatingInput';
import Button from 'Button';

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

    return (
      <div className="jira-auth">
        Authorize JIRA!
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
        <Button
          primary
          text="Authorize Jira"
          onClick={this.onClick}
          loading={loading}
        />
      </div>
    );
  }
}

export default JiraAuth;

const { string } = PropTypes;

JiraAuth.propTypes = {
  removeThis: string.isRequired,
};
