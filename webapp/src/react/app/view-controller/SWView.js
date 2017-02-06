import React, { Component, PropTypes } from 'react';

class SWView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
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
  render() {
    const { children } = this.props;
    return (
      <div className="sw-view">
        {this.renderHeader()}
        <div className="sw-view__scroll">
          <div className="sw-view__content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default SWView;

const { element } = PropTypes;

SWView.propTypes = {
  header: element,
  children: element,
};
