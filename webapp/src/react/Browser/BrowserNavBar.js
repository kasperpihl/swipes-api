import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cachedCallback from 'src/utils/cachedCallback';
import SW from './Browser.swiss';

class BrowserNavBar extends Component {
  handleActionCached = cachedCallback(name => {
    this.props.onAction(name);
  });
  renderNavigation() {
    const { backEnabled, forwardEnabled } = this.props;
    return [
      <SW.BackButton
        key="back"
        icon="ArrowLeftLine"
        compact
        disabled={!backEnabled}
        onClick={this.handleActionCached('back')}
      />,
      <SW.ForwardButton
        key="forward"
        icon="ArrowRightLine"
        compact
        disabled={!forwardEnabled}
        onClick={this.handleActionCached('forward')}
      />,
      <SW.ReloadButton
        key="reload"
        icon="Reload"
        compact
        onClick={this.handleActionCached('reload')}
      />
    ];
  }
  renderTitleURL() {
    const { title } = this.props;

    return (
      <SW.TitleWrapper className="wrapper">
        <SW.Title className="title">{title}</SW.Title>
      </SW.TitleWrapper>
    );
  }
  renderRightActions() {
    return [
      <SW.BrowserButton
        key="browser"
        icon="Earth"
        compact
        onClick={this.handleActionCached('browser')}
      />
    ];
  }
  render() {
    return (
      <SW.BrowserNavBar>
        <SW.Left>{this.renderNavigation()}</SW.Left>
        {this.renderTitleURL()}
        <SW.Right>{this.renderRightActions()}</SW.Right>
      </SW.BrowserNavBar>
    );
  }
}

export default BrowserNavBar;

const { string, object, bool } = PropTypes;

BrowserNavBar.propTypes = {
  delegate: object,
  backEnabled: bool,
  forwardEnabled: bool,
  title: string
};
