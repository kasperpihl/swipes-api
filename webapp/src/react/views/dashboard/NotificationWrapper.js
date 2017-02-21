import React, { Component, PropTypes } from 'react';
import { mapContains, listOf } from 'react-immutable-proptypes';
import Icon from 'Icon';

import './styles/notification-item';

class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderIcon() {
    const { notification: n } = this.props;

    if (!n.get('icon')) {
      return undefined;
    }

    return (
      <div className="notification__icon">
        <Icon svg={n.get('icon')} className="notification__svg" />
      </div>
    );
  }
  renderMessage() {
    const { notification: n } = this.props;

    if (!n.get('message')) {
      return undefined;
    }

    return (
      <div className="notification__message">{n.get('message')}</div>
    );
  }
  renderAttachments() {
    const { notification: n } = this.props;
    const attachments = n.get('attachments');

    if (!attachments) {
      return undefined;
    }

    const HTMLAttachments = attachments((a, i) => (
      <div className="attachment">
        <div className="attachment__icon">
          <Icon svg="Flag" className="attachment__svg" />
        </div>
        <div className="attachment__title">{a.get('title')}</div>
      </div>
      ));

    return (
      <div className="notification__attachments">
        {HTMLAttachments}
      </div>
    );
  }
  renderContent() {
    const { notification: n } = this.props;

    return (
      <div className="notification__content">
        <div className="notification__subtitle">{n.get('subtitle')}</div>
        <div className="notification__title">{n.get('title')}</div>
        {this.renderMessage()}
        {this.renderAttachments()}
      </div>
    );
  }
  renderTimestamp() {
    const { notification: n } = this.props;

    if (!n.get('timestamp')) {
      return undefined;
    }

    return <div className="notification__timestamp">{n.get('timestamp')}</div>;
  }
  render() {
    return (
      <div className="notification">
        {this.renderIcon()}
        {this.renderContent()}
        {this.renderTimestamp()}
      </div>
    );
  }
}

export default NotificationItem;

const { string, object } = PropTypes;

NotificationItem.propTypes = {
  delegate: object,
  notification: mapContains({
    icon: string,
    subtitle: string,
    title: string,
    message: string,
    attachments: listOf({
      icon: string,
      title: string,
    }),
    timestamp: string,
  }),
};
