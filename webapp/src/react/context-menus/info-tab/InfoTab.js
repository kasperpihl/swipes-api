import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
import Icon from 'Icon';
import './styles/info-tab.scss';

class InfoTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onInfoTabAction');
  }
  renderActions() {
    const { actions } = this.props;

    if(!actions) {
      return undefined;
    }

    const actionsHTML = actions.map((act, i) => {
      let iconClass = 'info-tab__action-icon';

      if (act.danger) {
        iconClass += ' info-tab__action-icon--danger'
      }

      return (
        <div className="info-tab__action">
          <Icon icon={act.icon} className={iconClass} />
          <div className="info-tab__action-title">{act.title}</div>
        </div>
      )
    })

    return (
      <div className="info-tab__actions">
        {actionsHTML}
      </div>
    )
  }
  renderInfo() {
    const { info } = this.props;

    if(!info) {
      return undefined;
    }

    const infoHTML = info.map((info, i) => {
      return (
        <div className="info-tab__info-row">
          <div className="info-tab__info-title-wrapper">
            <div className="info-tab__info-title">{info.title}</div>
            <div className="info-tab__info-action">{info.actionLabel}</div>
          </div>
          <div className="info-tab__info-text">{info.text}</div>
        </div>
      )
    })

    return (
      <div className="info-tab__info">
        {infoHTML}
      </div>
    )
  }
  renderAbout() {
    const { about } = this.props;

    return (
      <div className="info-tab__about">
        <div className="info-tab__about-header">
          <Icon icon="Close" className="info-tab__about-icon" />
          <div className="info-tab__about-title">{about.title}</div>
        </div>
        <div className="info-tab__about-text">
          {about.text}
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className="info-tab">
        {this.renderActions()}
        {this.renderInfo()}
        {this.renderAbout()}
      </div>
    );
  }
}

export default InfoTab

// const { string } = PropTypes;

InfoTab.propTypes = {};
