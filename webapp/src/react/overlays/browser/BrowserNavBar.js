import React, { Component, PropTypes } from 'react';
import { setupDelegate } from 'classes/utils';
import Button from 'Button';

class BrowserNavBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.callDelegate = setupDelegate(props.delegate);

    this.actions = {};
    ['back', 'forward', 'reload', 'browser', 'close'].forEach((act) => {
      this.actions[act] = this.onAction.bind(this, act);
    });
  }
  componentDidMount() {
  }
  onAction(action) {
    this.callDelegate('navbarAction', action);
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
        onClick={this.actions.back}
      />,
      <Button
        key="forward"
        icon="ArrowRightLine"
        className="browser-nav__btn"
        frameless
        disabled={!forwardEnabled}
        onClick={this.actions.forward}
      />,
      <Button
        key="reload"
        icon="Reload"
        className="browser-nav__btn"
        frameless
        onClick={this.actions.reload}
      />,
    ];
  }
  renderTitleURL() {
    const {
      title,
      url,
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
        onClick={this.actions.browser}
      />,
      <Button
        key="close"
        icon="Close"
        className="browser-nav__btn"
        frameless
        onClick={this.actions.close}
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
  url: string,
};
