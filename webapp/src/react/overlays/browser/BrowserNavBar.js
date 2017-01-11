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
        disabled={!backEnabled}
        onClick={this.actions.back}
      />,
      <Button
        key="forward"
        icon="ArrowRightLine"
        disabled={!forwardEnabled}
        onClick={this.actions.forward}
      />,
      <Button
        key="reload"
        onClick={this.actions.reload}
      />,
    ];
  }
  renderTitleURL() {
    const {
      title,
      url,
    } = this.props;


    return undefined;


    return (
      <div className="browser-nav-bar__title">
        {title} - {url}
      </div>
    );
  }
  renderRightActions() {
    return [
      <Button
        key="browser"
        icon="Earth"
        onClick={this.actions.browser}
      />,
      <Button
        key="close"
        icon="Close"
        onClick={this.actions.close}
      />,
    ];
  }
  render() {
    return (
      <div className="browser-nav-bar">
        {this.renderNavigation()}
        {this.renderTitleURL()}
        {this.renderRightActions()}
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
