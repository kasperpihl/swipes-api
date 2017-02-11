import React, { Component, PropTypes } from 'react';

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
      </div>
    );
  }
}

export default JiraAuth;

const { string } = PropTypes;

JiraAuth.propTypes = {
  removeThis: string.isRequired,
};
