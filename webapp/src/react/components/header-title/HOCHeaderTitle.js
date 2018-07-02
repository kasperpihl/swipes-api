import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setupDelegate } from 'react-delegate';
import Icon from 'Icon';
import SW from './HOCHeaderTitle.swiss';

export default class HOCHeaderTitle extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this, 'onTitleClick', 'navbarLoadedInput');
  }
  componentDidMount() {
    const { input } = this.refs;
    this.navbarLoadedInput(input);
  }
  renderInputTitle(placeholder) {
    const {
      title,
      pop, // eslint-disable-line
      children, // eslint-disable-line
      delegate, // eslint-disable-line
      ...rest
    } = this.props;

    return (
      <SW.Input
        type="text"
        ref="input"
        {...rest}
        key="header-input"
      />
    );
  }

  renderSubtitle() {
    const { subtitle } = this.props;

    if (!subtitle) return undefined;

    return <SW.Subtitle>{subtitle}</SW.Subtitle>;

  }
  renderTitle() {
    const { title, subtitleElement } = this.props;

    return (
      <SW.Title key="header-title" onClick={this.onTitleClick}>
        {title}
        {this.renderSubtitle()}
      </SW.Title>
    );
  }
  renderContent() {
    const { title, placeholder } = this.props;

    if (placeholder) {
      return this.renderInputTitle(placeholder);
    }

    return this.renderTitle();
  }
  render() {
    const { children, subtitle, border } = this.props;

    return (
      <SW.Wrapper noSubtitle={!subtitle ? true : undefined} Border={border ? true : undefined}>
        {this.renderContent()}
        <SW.Actions>
          {children}
        </SW.Actions>
      </SW.Wrapper>
    );
  }
}
