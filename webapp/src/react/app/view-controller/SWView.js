import React, { Component, PropTypes } from 'react';
import { debounce } from 'classes/utils';
import Measure from 'react-measure';

import './styles/view-controller.scss';

class SWView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      center: false,
    };
    this.bouncedMeasure = debounce(this.onMeasure, 1);

    this.onMeasure = this.onMeasure.bind(this);
  }
  componentDidMount() {
  }
  onMeasure(dim) {
    if (dim.width < 1200) {
      this.setState({ center: true });
    } else {
      this.setState({ center: false });
    }
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
    const { children, maxWidth } = this.props;
    const { center } = this.state;
    const styles = {};
    let className = 'sw-view';

    if (maxWidth) {
      styles.maxWidth = `${maxWidth}px`;
    }

    if (center) {
      className += ' sw-view--center-content ';
    }

    return (
      <Measure onMeasure={this.onMeasure}>
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
      </Measure>
    );
  }
}

export default SWView;

const { element, number } = PropTypes;

SWView.propTypes = {
  header: element,
  children: element,
  maxWidth: number,
};
