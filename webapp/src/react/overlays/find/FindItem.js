import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import Button from 'Button';
import { map } from 'react-immutable-proptypes';
import { iconForService } from 'classes/utils';

import './styles/find-item.scss';

class FindItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
    return (
      <div className="find-item__actions">
        <div className="find-item__action">
          <Button small primary text="Add to collection" />
        </div>
        <div className="find-item__action">
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
      <div className={className}>
        {this.renderContent()}
        {this.renderService()}
        {this.renderActions()}
      </div>
    );
  }
}

const { bool } = PropTypes;

FindItem.propTypes = {
  small: bool,
  data: map,
};

export default FindItem;
