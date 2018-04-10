import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { styleElement } from 'react-swiss';
import { connect } from 'react-redux';
import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
import prefixAll from 'inline-style-prefixer/static';
// import { fromJS } from 'immutable';

import styles from './Tooltip.swiss';

const Wrapper = styleElement('div', styles, 'Wrapper');
const Content = styleElement('div', styles, 'Content');

const SPACING = 20;

class HOCTooltip extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      styles: {},
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.tooltip !== this.props.tooltip) {
      this.setState({ styles: this.getStyles(nextProps.tooltip) });
    }
  }
  componentDidUpdate() {
    this.fitToScreen();
  }
  getStyles(tooltip) {
    const styles = {};

    if (tooltip) {
      const boundingRect = tooltip.options.boundingRect;
      const position = tooltip.options.position || 'left';
      let transform = '';

      if (position === 'left') {
        styles.left = `${boundingRect.left - SPACING}px`;
        styles.transform = transform += 'translateX(-100%) ';
      } else if (position === 'top') {
        styles.top = `${boundingRect.top - SPACING}px`;
        styles.transform = transform += 'translateY(-100%) ';
      } else if (position === 'right') {
        styles.left = `${boundingRect.left + boundingRect.width + SPACING}px`;
      } else {
        styles.top = `${boundingRect.top + boundingRect.height + SPACING}px`;
      }

      if (position === 'left' || position === 'right') {
        styles.top = `${boundingRect.top + (boundingRect.height / 2)}px`;
        styles.transform = transform += 'translateY(-50%) ';
      }

      if (position === 'top' || position === 'bottom') {
        styles.left = `${boundingRect.left + (boundingRect.width / 2)}px`;
        styles.transform = transform += 'translateX(-50%) ';
      }
    }

    return styles;
  }
  fitToScreen() {
    const { tooltip } = this.props;
    const { styles } = this.state;
    const ww = window.innerWidth;
    const wh = window.innerHeight;
    const newStyles = {};

    if (this.tooltipRef) {
      const tooltipBoundingRect = this.tooltipRef.getBoundingClientRect();
      const targetBoundingRect = tooltip.options.boundingRect;
      const position = tooltip.options.position || 'left';
      let left = parseInt(styles.left);
      let top = parseInt(styles.top);

    // Get correct positions
      if (position === 'left') {
        left -= tooltipBoundingRect.width;
        top -= (tooltipBoundingRect.height / 2);
      }

      if (position === 'right') {
        top -= (tooltipBoundingRect.height / 2);
      }

      if (position === 'top') {
        top -= tooltipBoundingRect.height;
        left -= (tooltipBoundingRect.width / 2);
      }

      if (position === 'bottom') {
        left -= (tooltipBoundingRect.width / 2);
      }


    // Get new styles

      if (position === 'left' || position === 'right') {
        let transform = '';
        if (left < SPACING) { // Outbounds to left
          newStyles.left = `${targetBoundingRect.left + targetBoundingRect.width + tooltipBoundingRect.width + SPACING}px`;
          newStyles.transform = transform += 'translateX(-100%) ';
        }

        if ((left + tooltipBoundingRect.width) > (ww - SPACING)) { // Outbounds to right
          newStyles.left = `${targetBoundingRect.left - tooltipBoundingRect.width - SPACING}px`;
          newStyles.transform = transform;
        }

        if (top < SPACING) { // Outbounds to top
          newStyles.top = `${SPACING}px`;
        } else if ((top + tooltipBoundingRect.height) > (wh - SPACING)) { // Outbounds to bottom
          newStyles.top = `${wh - tooltipBoundingRect.height - SPACING}px`;
        } else {
          newStyles.transform = transform += 'translateY(-50%) ';
        }
      } else if (position === 'top' || position === 'bottom') {
        let transform = '';

        if (top < SPACING) { // Outbounds to top
          newStyles.top = `${targetBoundingRect.top + targetBoundingRect.height + SPACING}px`;
          newStyles.transform = transform;
        }

        if ((top + tooltipBoundingRect.height) > (wh - SPACING)) { // Outbounds to bottom
          newStyles.top = `${targetBoundingRect.top - tooltipBoundingRect.height - SPACING}px`;
          newStyles.transform = transform;
        }

        if (left < SPACING) { // Outbounds to left
          newStyles.left = `${SPACING}px`;
        } else if ((left + tooltipBoundingRect.width) > (ww - SPACING)) { // Outbounds to right
          newStyles.left = `${ww - tooltipBoundingRect.width - SPACING}px`;
        } else {
          newStyles.transform = transform += 'translateX(-50%) ';
        }
      }

      if (newStyles.left || newStyles.right || newStyles.top || newStyles.bottom) {
        if (newStyles.top !== styles.top || newStyles.bottom !== styles.bottom) {
          this.setState({ styles: Object.assign({}, styles, newStyles) });
        } else if (newStyles.left !== styles.left || newStyles.right !== styles.right) {
          this.setState({ styles: Object.assign({}, styles, newStyles) });
        }
      }
    }
  }
  renderTooltip() {
    const { tooltip } = this.props;

    if (!tooltip) {
      return undefined;
    }

    const Comp = tooltip.component;
    const props = tooltip.props || {};

    return (
      <Content 
        style={prefixAll(this.state.styles)} 
        innerRef={(r) => { this.tooltipRef = r; }}>
        <Comp {...props} />
      </Content>
    );
  }
  render() {
    const { tooltip } = this.props;
    let className = 'g-tooltip';

    if (tooltip) {
      className += ' g-tooltip--shown';
    }

    return (
      <Wrapper shown={!!this.props.tooltip}>
        {this.renderTooltip()}
      </Wrapper>
    );
  }
}

const { object } = PropTypes;

HOCTooltip.propTypes = {
  tooltip: object,
};

function mapStateToProps(state) {
  return {
    tooltip: state.getIn(['main', 'tooltip']),
  };
}

export default connect(mapStateToProps, {
})(HOCTooltip);
