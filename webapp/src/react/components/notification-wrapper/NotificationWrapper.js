import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { mapContains, list } from 'react-immutable-proptypes';
import Icon from 'Icon';
import { setupDelegate, setupCachedCallback, attachmentIconForService } from 'swipes-core-js/classes/utils';

import './styles/notification-item';

class NotificationItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, props.i);
    this.onAttachmentClick = setupCachedCallback(this.callDelegate.bind(null, 'onClickAttachment'));
    this.onReply = this.callDelegate.bind(null, 'onReply');
    this.onClick = this.onClick.bind(this);
  }
  onClick(e) {
    const { notification: n } = this.props;
    const selection = window.getSelection();

    if (selection.toString().length === 0 && !n.get('noClickTitle')) {
      this.callDelegate('onClickTitle', e);
    }
  }
  renderIcon() {
    const { notification: n } = this.props;

    if (!n.get('icon')) {
      return undefined;
    }

    return (
      <div className="notification__icon-wrapper">
        <div className="notification__icon">
          <Icon icon={n.get('icon')} className="notification__svg" />
        </div>
      </div>
    );
  }
  renderTitleWrapper() {
    const { notification: n } = this.props;

    return (
      <div className="notification__title-wrap">
        {this.renderTitle(n.get('title'))}
        <div className="notification__subtitle">
          <span onClick={this.onClick}>
            {n.get('subtitle')}
          </span>
          {
            n.get('subtitle') ? (
            ' • '
            ) : (
              undefined
            )
          }
          {n.get('timeago')}</div>
      </div>
    );
  }
  renderTitle(title) {
    if (!title) {
      return undefined;
    }

    if (!Array.isArray(title)) {
      title = [title];
    }

    return title.map((t, i) => (
      <div key={i} className="notification__title">{t}</div>
    ));
  }
  renderActions() {
    const { notification: n } = this.props;

    if (!n.get('reply')) {
      return undefined;
    }
    if (n.get('reply') === 'replied') {
      return (
        <div className="notification__reply notification__reply--replied">
          Replied
        </div>
      );
    }

    return (
      <div className="notification__reply" onClick={this.onReply}>
        Reply
      </div>
    );
  }
  renderMessage() {
    const { notification: n } = this.props;

    if (!n.get('message')) {
      return undefined;
    }

    return (
      <div className="notification__message">&bdquo;{n.get('message')}&ldquo;</div>
    );
  }
  renderAttachments() {
    const { notification: n } = this.props;
    const attachments = n.get('attachments');

    if (!attachments) {
      return undefined;
    }

    const HTMLAttachments = attachments.map((att, i) => (
      <div onClick={this.onAttachmentClick(i)} className="notif-attachment" key={i}>
        <div className="notif-attachment__icon">
          <Icon
            icon={attachmentIconForService(att.getIn(['link', 'service']) || att)}
            className="notif-attachment__svg"
          />
        </div>
        <div className="notif-attachment__title">{att.get('title')}</div>
      </div>
    ));

    return (
      <div className="notification__attachments">
        {HTMLAttachments}
      </div>
    );
  }
  render() {
    const { notification: n, delegate, noBorder, narrow } = this.props;
    let className = 'notification';

    if (n.get('unseen')) {
      className += ' notification--unseen';
    }

    if (typeof delegate.onClickTitle === 'function' && !n.get('noClickTitle')) {
      className += ' notification--clickable';
    }

    if (noBorder) {
      className += ' notification--no-border';
    }

    if (narrow) {
      className += ' notification--narrow';
    }

    if (!n.get('icon')) {
      className += ' notification--small';
    }

    return (
      <div className={className}>
        <div className="notification__section">
          {this.renderIcon()}
          {this.renderTitleWrapper()}
          {this.renderActions()}
        </div>
        <div className="notification__section">
          {this.renderMessage()}
          {this.renderAttachments()}
        </div>
      </div>
    );
  }
}

export default NotificationItem;

const { string, object, number, bool, oneOfType, array } = PropTypes;

NotificationItem.propTypes = {
  i: number,
  delegate: object,
  noBorder: bool,
  narrow: bool,
  notification: mapContains({
    icon: string,
    subtitle: string,
    noClickTitle: bool,
    title: oneOfType([array, string]),
    message: string,
    attachments: list,
    timeago: string,
  }),
};
