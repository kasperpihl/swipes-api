import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import Button from 'Button';

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
        className="browser-nav__btn"
        frameless
        disabled={!backEnabled}
        onClick={this.navbarActionCached('back')}
      />,
      <Button
        key="forward"
        icon="ArrowRightLine"
        className="browser-nav__btn"
        frameless
        disabled={!forwardEnabled}
        onClick={this.navbarActionCached('forward')}
      />,
      <Button
        key="reload"
        icon="Reload"
        className="browser-nav__btn"
        frameless
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
        className="browser-nav__btn"
        frameless
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
