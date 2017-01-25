import React, { Component, PropTypes } from 'react';
import { map } from 'react-immutable-proptypes';

class HandoffMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }

  render() {
    const {
      user,
      message,
      at,
    } = this.props;
    let name;
    let src;
    if (user) {
      name = user.get('name').split(' ')[0];
      src = user.get('profile_pic');
    }
    return (
      <div className="handoff-message" />
    );
  }
}

export default HandoffMessage;

const { string } = PropTypes;

HandoffMessage.propTypes = {
  user: map,
  message: string,
};
