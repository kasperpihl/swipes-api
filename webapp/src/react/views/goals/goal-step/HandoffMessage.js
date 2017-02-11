import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import { map } from 'react-immutable-proptypes';

import './styles/handoff-message.scss';

class HandoffMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount() {
  }
  handleClick() {
    const { onClick, user } = this.props;

    if (onClick) {
      onClick(user.get('id'));
    }
  }
  renderAvatar(src, name) {
    const firstLetter = name.charAt(0);

    if (src) {
      return (
        <div className="handoff-message__image">
          <img src={src} alt="" />
        </div>
      );
    }

    return (
      <div className="handoff-message__initials">{firstLetter}</div>
    );
  }
  render() {
    const {
      user,
      message,
    } = this.props;

    let name;
    let src;

    if (user) {
      name = user.get('name').split(' ')[0];
      src = user.get('profile_pic');
    }

    return (
      <div className="handoff-message">
        <div className="handoff-message__header">
          {this.renderAvatar(src, name)}
          <div className="handoff-message__name" onClick={this.handleClick}>
            {name}
            <Icon svg="SlackLogo" className="handoff-message__slack-icon" />
          </div>
          <div className="handoff-message__time">Jan 12</div>
        </div>

        <div className="handoff-message__message">{message}</div>
      </div>
    );
  }
}

export default HandoffMessage;

const { string, func } = PropTypes;

HandoffMessage.propTypes = {
  user: map,
  message: string,
  onClick: func,
};
