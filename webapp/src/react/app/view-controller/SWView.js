import React, { Component } from 'react';

import './styles/view-controller.scss';

export default class SWView extends Component {
  componentDidMount() {
    const { initialScroll, scrollToBottom } = this.props;

    if (initialScroll > 0) {
      this.refs.scroller.scrollTop = initialScroll;
    }

    if (scrollToBottom) {
      const scroller = this.refs.scroller;
      scroller.scrollTop = scroller.scrollHeight;
    }
  }
  renderHeader() {
    const { header } = this.props;

    if (!header) {
      return undefined;
    }

    return (
      <div className="sw-view__header">
        {header}
      </div>
    );
  }
  renderFooter() {
    const { footer } = this.props;

    if (!footer) {
      return undefined;
    }

    return (
      <div className="sw-view__footer">
        {footer}
      </div>
    );
  }
  render() {
    const { children, disableScroll, noframe, onScroll } = this.props;
    let className = 'sw-view';

    if (disableScroll) {
      className += ' sw-view--no-scroll';
    }

    if (noframe) {
      className += ' sw-view--no-frame';
    }

    return (
      <div className={className}>
        {this.renderHeader()}
        <div className="sw-view__scroll" ref="scroller" onScroll={onScroll}>
          <div className="sw-view__container">
            <div className="sw-view__content">
              {children}
            </div>
          </div>
        </div>
        {this.renderFooter()}
      </div>
    );
  }
}