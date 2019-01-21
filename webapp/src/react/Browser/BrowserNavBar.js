import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import SW from './Browser.swiss';

class BrowserNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this, 'navbarAction');

  }
  renderNavigation() {
    const {
      backEnabled,
      forwardEnabled,
    } = this.props;
    return [
      <SW.BackButton
        key="back"
        icon="ArrowLeftLine"
        compact
        disabled={!backEnabled}
        onClick={this.navbarActionCached('back')}
      />,
      <SW.ForwardButton
        key="forward"
        icon="ArrowRightLine"
        compact
        disabled={!forwardEnabled}
        onClick={this.navbarActionCached('forward')}
      />,
      <SW.ReloadButton
        key="reload"
        icon="Reload"
        compact
        onClick={this.navbarActionCached('reload')}
      />,
    ];
  }
  renderTitleURL() {
    const {
      title,
    } = this.props;

    return (
      <SW.TitleWrapper className='wrapper'>
        <SW.Title className='title'>
          {title}
        </SW.Title>
      </SW.TitleWrapper>
    );
  }
  renderRightActions() {
    return [
      <SW.BrowserButton
        key="browser"
        icon="Earth"
        compact
        onClick={this.navbarActionCached('browser')}
      />,
    ];
  }
  render() {
    return (
      <SW.BrowserNavBar>
        <SW.Left>
          {this.renderNavigation()}
        </SW.Left>
        {this.renderTitleURL()}
        <SW.Right>
          {this.renderRightActions()}
        </SW.Right>
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
  title: string,
};
