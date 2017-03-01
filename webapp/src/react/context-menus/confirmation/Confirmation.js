import React, { Component, PropTypes } from 'react';
import { setupCachedCallback } from 'classes/utils';
import Button from 'Button';

import './styles/confirmation.scss';

class Confirmation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(props.onClick, this);
  }
  renderTitle() {
    const { title } = this.props;

    if (!title) {
      return undefined;
    }

    return <div className="confirmation__title">{title}</div>;
  }
  renderMessage() {
    const { message } = this.props;

    if (!message) {
      return undefined;
    }

    return <div className="confirmation__message">{message}</div>;
  }
  renderActions() {
    let { actions } = this.props;

    if (!actions) {
      actions = [
        {
          text: 'No',
        },
        {
          text: 'Yes',
        },
      ];
    }

    const renderButtons = actions.map((a, i) => {
      const props = {
        ...a,
      };

      const isLast = (actions.length - 1) === i;

      return <Button primary={isLast} {...props} key={i} onClick={this.onClickCached(i)} className="confirmation__button" />;
    });

    return (
      <div className="confirmation__actions">
        {renderButtons}
      </div>
    );
  }
  render() {
    return (
      <div className="confirmation">
        {this.renderTitle()}
        {this.renderMessage()}
        {this.renderActions()}
      </div>
    );
  }
}

export default Confirmation;

const { string, array } = PropTypes;

Confirmation.propTypes = {
  title: string,
  message: string,
  actions: array,
};
