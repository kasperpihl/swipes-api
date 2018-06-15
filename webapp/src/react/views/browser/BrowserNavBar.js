import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import Button from 'src/react/components/button/Button';

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
      <Button
        key="back"
        icon="ArrowLeftLine"
        compact
        disabled={!backEnabled}
        onClick={this.navbarActionCached('back')}
      />,
      <Button
        key="forward"
        icon="ArrowRightLine"
        compact
        disabled={!forwardEnabled}
        onClick={this.navbarActionCached('forward')}
      />,
      <Button
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
      <div className="browser-nav__title">
        {title}
      </div>
    );
  }
  renderRightActions() {
    return [
      <Button
        key="browser"
        icon="Earth"
        compact
        onClick={this.navbarActionCached('browser')}
      />,
    ];
  }
  render() {
    return (
      <div className="browser-nav">
        <div className="browser-nav__left">
          {this.renderNavigation()}
        </div>
        {this.renderTitleURL()}
        <div className="browser-nav__right">
          {this.renderRightActions()}
        </div>
      </div>
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
