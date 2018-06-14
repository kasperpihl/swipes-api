import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupDelegate } from 'react-delegate';
import { styleElement } from 'swiss-react';
import Button from 'src/react/components/button/Button';
import styles from './Browser.swiss';

const Title = styleElement('div', styles.Title);
const BrowserNav = styleElement('div', styles.BrowserNav);
const Left = styleElement('div', styles.Left);
const Right = styleElement('div', styles.Right);

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
      <Title>
        {title}
      </Title>
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
      <BrowserNav>
        <Left>
          {this.renderNavigation()}
        </Left>
        {this.renderTitleURL()}
        <Right>
          {this.renderRightActions()}
        </Right>
      </BrowserNav>
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
