import React, { Component, PropTypes } from 'react';
import FloatingInput from 'components/swipes-ui/FloatingInput';
import Button from 'Button';

class JiraAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
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
        <Button primary text="Authorize Jira" />
      </div>
    );
  }
}

export default JiraAuth;

const { string } = PropTypes;

JiraAuth.propTypes = {
  removeThis: string.isRequired,
};
