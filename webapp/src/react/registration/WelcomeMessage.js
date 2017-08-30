import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        <div className="welcome-message__illustration"></div>
        <div className="welcome-message__paragraph">This is the place for your team to communicate and create great work together.</div>
        <div className="welcome-message__paragraph">We are thrilled to have you here!</div>
        <div className="welcome-message__signature">
          <Icon icon="SwipesSignature" className="welcome-message__svg" />
        </div>
      </div>
    );
  }
}

export default WelcomeMessage;
