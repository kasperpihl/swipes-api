import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import Button from 'Button';

import './styles/find-item.scss';

class FindItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  renderContent() {
    return (
      <div className="find-item__content">
        <div className="find-item__title">Screen Shot 2016-06-07 at 5.12.07 PM.png</div>
        <div className="find-item__description">
          This summer, motion designer, art director and long-term Computer Arts collaborator Alex Donne-Johnson (aka Vector Meldrew) gave up a healthy freelance career to form his
          This summer, motion designer, art director and long-term Computer Arts collaborator Alex Donne-Johnson (aka Vector Meldrew) gave up a healthy freelance career to form his
        </div>
      </div>
    );
  }
  renderService() {
    return (
      <div className="find-item__service">
        <Icon svg="SlackIcon" className="find-item__icon" />
      </div>
    );
  }
  renderActions() {
    return (
      <div className="find-item__actions">
        <div className="find-item__action">
          <Button small="true" primary="true" text="Add to collection" />
        </div>
        <div className="find-item__action">
          <Button small="true" text="Share" />
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

export default FindItem;
