import React, { PureComponent } from 'react';

import { setupDelegate, setupCachedCallback } from 'react-delegate';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';

import TextParser from 'components/text-parser/TextParser';
import Icon from 'Icon';
import './styles/info-tab.scss';

class InfoTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onInfoTabAction', 'onInfoTabInfo');
    this.onActionClickCached = setupCachedCallback(this.onActionClick, this);
    this.onInfoClickCached = setupCachedCallback(this.onInfoClick, this);
  }
  onActionClick(i, e) {
    const { hide, __options } = this.props;
    hide();
    this.onInfoTabAction(i, __options, e);
  }
  onInfoClick(i, e) {
    const { hide, __options } = this.props;
    hide();
    this.onInfoTabInfo(i, __options, e);
  }
  renderActionIcon(icon, iconClass) {
    if (!icon) {
      return undefined;
    }

    return <Icon icon={icon} className={iconClass} />
  }
  renderActions() {
    const { actions } = this.props;

    if(!actions) {
      return undefined;
    }

    const actionsHTML = actions.map((act, i) => {
      console.log(act);
      let iconClass = 'info-tab__action-icon';

      if (act.danger) {
        iconClass += ' info-tab__action-icon--danger';
      }

      if (act.complete) {
        iconClass += ' info-tab__action-icon--complete';
      }

      return (
        <div className="info-tab__action" key={i} onClick={this.onActionClickCached(i)}>
          <div className="info-tab__action-icon-wrapper">
            {this.renderActionIcon(act.icon, iconClass)}
          </div>
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
        <div className="info-tab__info-row"  key={info.title + i}>
          <div className="info-tab__info-title-wrapper">
            <div className="info-tab__info-title">{info.title}</div>
            <div className="info-tab__info-action" onClick={this.onInfoClickCached(i)}>
              {info.actionLabel}
            </div>
          </div>
          <div className="info-tab__info-text">
            {info.icon ? (
              <Icon icon={info.icon} className="info-tab__info-svg" />
            ) : null}
            {info.text}
          </div>
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
          <Icon icon="Question" className="info-tab__about-icon" />
          <div className="info-tab__about-title">{about.title}</div>
        </div>
        <TextParser className="info-tab__about-text">
          {about.text}
        </TextParser>
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
