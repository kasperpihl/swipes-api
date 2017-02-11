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
  render() {
    const { children, maxWidth, disableScroll } = this.props;
    const styles = {};
    let className = 'sw-view';

    if (maxWidth) {
      styles.maxWidth = `${maxWidth}px`;
    }

    if (disableScroll) {
      className += ' sw-view--no-scroll';
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
      </div>
    );
  }
}

export default SWView;

const { element, number, bool } = PropTypes;

SWView.propTypes = {
  header: element,
  children: element,
  maxWidth: number,
  disableScroll: bool,
};
