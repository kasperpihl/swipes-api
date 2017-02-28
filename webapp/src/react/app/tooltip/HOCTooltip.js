import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as a from 'actions';
import { map } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';

import './styles/tooltip.scss';

const SPACING = 20;

class HOCTooltip extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      styles: {},
    };
  }
  componentDidMount() {

  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.tooltip !== this.props.tooltip) {
      this.setState({ styles: this.getStyles(nextProps.tooltip) });
    }
  }
  getStyles(tooltip) {
    const styles = {};

    if (tooltip) {
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const boundingRect = tooltip.options.boundingRect;
      const position = tooltip.options.position || 'left';

      if (['left', 'right'].indexOf(position) !== -1) {
        styles.top = `${boundingRect.top + (boundingRect.height / 2)}px`;
        styles.transform = 'translateY(-50%)';
        if (position === 'left') {
          styles.right = `${ww - boundingRect.left + SPACING}px`;
        } else {
          styles.left = `${boundingRect.left + boundingRect.width + SPACING}px`;
        }
      }
    }

    return styles;
  }
  renderTooltip() {
    const { tooltip } = this.props;

    if (!tooltip) {
      return undefined;
    }

    const Comp = tooltip.component;
    const props = tooltip.props || {};

    return (
      <div className="g-tooltip__content" style={this.state.styles}>
        <Comp {...props} />
      </div>
    );
  }
  render() {
    const { tooltip } = this.props;
    let className = 'g-tooltip';

    if (tooltip) {
      className += ' g-tooltip--shown';
    }

    return (
      <div className={className}>
        {this.renderTooltip()}
      </div>
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
