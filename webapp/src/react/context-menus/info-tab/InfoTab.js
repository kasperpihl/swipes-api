import React, { PureComponent } from 'react';

import { setupDelegate, setupCachedCallback } from 'react-delegate';
import SW from './InfoTab.swiss';

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
  renderActionIcon(icon, danger, complete) {
    if (!icon) {
      return undefined;
    }

    return <SW.ActionIcon icon={icon} danger={danger} complete={complete} />
  }
  renderActions() {
    const { actions } = this.props;

    if(!actions) {
      return undefined;
    }

    const actionsHTML = actions.map((act, i) => {
      console.log(act);
      let danger = '';
      let complete = '';

      if (act.danger) {
        danger = true;
      }

      if (act.complete) {
        complete = true;
      }

      return (
        <SW.Action key={i} onClick={this.onActionClickCached(i)}>
          <SW.ActionIconWrapper>
            {this.renderActionIcon(act.icon, danger, complete)}
          </SW.ActionIconWrapper>
          <SW.ActionTitle>{act.title}</SW.ActionTitle>
        </SW.Action>
      )
    })

    return (
      <SW.ActionWrapper>
        {actionsHTML}
      </SW.ActionWrapper>
    )
  }
  renderInfo() {
    const { info } = this.props;

    if(!info) {
      return undefined;
    }

    const infoHTML = info.map((info, i) => {
      return (
        <SW.InfoRow key={info.title + i}>
          <SW.InfoTitleWrapper>
            <SW.InfoTitle>{info.title}</SW.InfoTitle>
            <SW.InfoAction onClick={this.onInfoClickCached(i)}>
              {info.actionLabel}
            </SW.InfoAction>
          </SW.InfoTitleWrapper>
          <SW.InfoText>
            {info.icon ? (
              <SW.InfoSVG icon={info.icon}/>
            ) : null}
            {info.text}
          </SW.InfoText>
        </SW.InfoRow>
      )
    })

    return (
      <SW.Info>
        {infoHTML}
      </SW.Info>
    )
  }
  renderAbout() {
    const { about } = this.props;

    return (
      <SW.About>
        <SW.AboutHeader>
          <SW.AboutIcon icon="Question"/>
          <SW.AboutTitle>{about.title}</SW.AboutTitle>
        </SW.AboutHeader>
        <SW.AboutText>
          {about.text}
        </SW.AboutText>
      </SW.About>
    )
  }
  render() {
    return (
      <SW.Wrapper>
        {this.renderActions()}
        {this.renderInfo()}
        {this.renderAbout()}
      </SW.Wrapper>
    );
  }
}

export default InfoTab;
