import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';

import './styles/welcome-message.scss';

class WelcomeMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="welcome-message">
        <div className="welcome-message__title">Welcome to your Workspace</div>
        <div className="welcome-message__paragraph">We are thrilled to have you join in and are committed to make this a great experience for you and your team! </div>
        <div className="welcome-message__paragraph">Swipes brings together your team, communication, and files, all in one place. You can see what to work on next, you can pass on work to one another, give feedback and see how your part adds up to the big team effort.</div>
        <div className="welcome-message__signature">
          <Icon icon="SwipesSignature" className="welcome-message__svg" />
        </div>
      </div>
    );
  }
}

export default WelcomeMessage;
