import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import Button from 'Button';
import { map } from 'react-immutable-proptypes';
import { iconForService, setupDelegate, bindAll } from 'classes/utils';

import './styles/find-item.scss';

class FindItem extends Component {
  constructor(props) {
    super(props);
    this.callDelegate = setupDelegate(props.delegate, props.index);
    bindAll(this, ['onShare', 'onClick', 'onAction']);
  }
  onShare(e) {
    e.stopPropagation();
    this.callDelegate('findItemShare');
  }
  onClick() {
    this.callDelegate('findItemClick');
  }
  onAction(e) {
    e.stopPropagation();
    this.callDelegate('findItemAction');
  }
  renderContent() {
    const {
      data,
    } = this.props;
    return (
      <div className="find-item__content">
        <div className="find-item__title">
          {data.get('title')}
        </div>
        <div className="find-item__description">
          {data.get('description') || data.get('subtitle')}
        </div>
      </div>
    );
  }
  renderService() {
    const {
      data,
    } = this.props;
    const service = data.get('service');

    return (
      <div className="find-item__service">
        <Icon svg={iconForService(service)} className="find-item__icon" />
      </div>
    );
  }
  renderActions() {
    const { actionLabel } = this.props;
    let customActionHtml;
    if (actionLabel && actionLabel.length) {
      customActionHtml = (
        <div className="find-item__action" onClick={this.onAction}>
          <Button small primary text={actionLabel} className="find-item__btn" />
        </div>
      );
    }
    return (
      <div className="find-item__actions">
        {customActionHtml}
        <div className="find-item__action" onClick={this.onShare}>
          <Button small text="Share" />
        </div>
      </div>
    );
  }
  render() {
    const { small } = this.props;
    let className = 'find-item';

    if (small) {
      className += ' find-item--small';
    }

    return (
      <div className={className} onClick={this.onClick}>
        {this.renderContent()}
        {this.renderService()}
        {this.renderActions()}
      </div>
    );
  }
}

const { bool, object, number, string } = PropTypes;

FindItem.propTypes = {
  small: bool,
  actionLabel: string,
  data: map,
  index: number,
  delegate: object,
};

export default FindItem;
