import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './styles/view-controller.scss';

class SWView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentDidMount() {
    const { initialScroll } = this.props;

    if (initialScroll > 0) {
      this.refs.scroller.scrollTop = initialScroll;
    }
  }
  componentDidUpdate() {
    if (this.props.scrollToBottom) {
      const scroller = this.refs.scroller;
      // console.log(scroller);
      scroller.scrollTop = scroller.scrollHeight - scroller.clientHeight;
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

export default SWView;

const { element, number, bool, arrayOf, oneOfType, func } = PropTypes;

SWView.propTypes = {
  onScroll: func,
  header: element,
  footer: element,
  children: oneOfType([element, arrayOf(element)]),
  noframe: bool,
  disableScroll: bool,
};
