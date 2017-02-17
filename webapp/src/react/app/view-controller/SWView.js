import React, { Component, PropTypes } from 'react';

import './styles/view-controller.scss';

class SWView extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  renderHeader() {
    const { header, maxWidth } = this.props;

    if (!header) {
      return undefined;
    }

    const styles = {};

    if (maxWidth) {
      styles.maxWidth = `${maxWidth}px`;
    }

    return (
      <div className="sw-view__header" style={styles}>
        {header}
      </div>
    );
  }
  renderFooter() {
    const { footer, maxWidth } = this.props;

    if (!footer) {
      return undefined;
    }

    const styles = {};

    if (maxWidth) {
      styles.maxWidth = `${maxWidth}px`;
    }

    return (
      <div className="sw-view__footer" style={styles}>
        {footer}
      </div>
    );
  }
  render() {
    const { children, maxWidth, disableScroll, noframe } = this.props;
    const styles = {};
    let className = 'sw-view';

    if (maxWidth) {
      styles.maxWidth = `${maxWidth}px`;
    }

    if (disableScroll) {
      className += ' sw-view--no-scroll';
    }

    if (noframe) {
      className += ' sw-view--no-frame';
    }

    return (
      <div className={className}>
        {this.renderHeader()}
        <div className="sw-view__scroll">
          <div className="sw-view__container">
            <div className="sw-view__content" style={styles}>
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

const { element, number, bool, arrayOf, oneOfType } = PropTypes;

SWView.propTypes = {
  header: element,
  footer: element,
  children: oneOfType([element, arrayOf(element)]),
  maxWidth: number,
  disableScroll: bool,
};
