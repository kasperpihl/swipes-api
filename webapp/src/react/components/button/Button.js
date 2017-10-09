import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { tooltip } from 'actions/main';
// import * as ca from 'swipes-core-js/actions';
import { bindAll, getParentByClass } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Icon from 'Icon';
import ButtonTooltip from './ButtonTooltip';
import RotateLoader from 'components/loaders/RotateLoader';
import './styles/button.scss';

const MIN_TIME = 1000;
const SUCCESS_TIMER = 3000;

class Button extends PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);

    bindAll(this, ['onMouseEnter', 'onMouseLeave']);
  }

  onClick(e) {
    const { onClick, disabled } = this.props;

    if (onClick && !disabled) {
      onClick(e);
    }

    this.refs.button.blur();
  }
  onMouseEnter(e) {
    const { loadTooltip, tooltipLabel } = this.props;
    const target = getParentByClass(e.target, 'g-button');
    const position = 'top';

    if (!tooltipLabel) {
      return undefined;
    }

    const data = {
      component: ButtonTooltip,
      props: {
        label: tooltipLabel,
      },
      options: {
        boundingRect: target.getBoundingClientRect(),
        position,
      },
    };

    loadTooltip(data);
  }
  onMouseLeave() {
    const { loadTooltip, tooltipLabel } = this.props;

    if (!tooltipLabel) {
      return undefined;
    }

    loadTooltip(null);
  }
  renderIcon() {
    const { icon } = this.props;

    if (!icon) {
      return undefined;
    }

    return <Icon icon={icon} className="g-button__svg" />;
  }
  renderText() {
    const { text } = this.props;

    if (!text) {
      return undefined;
    }

    return (
      <div className="g-button__text">{text}</div>
    );
  }
  renderResultState() {
    const { successLabel, errorLabel } = this.props;
    let label = '';
    let icon = '';

    if (!successLabel && !errorLabel) {
      return undefined;
    }

    label = successLabel || errorLabel;
    icon = successLabel ? 'Checkmark' : 'Close';

    return (
      <div className="g-button__result-state">
        <Icon icon={icon} className="g-button__svg" />
        <div className="g-button__text">{label}</div>
      </div>
    );
  }
  render() {
    const {
      primary,
      icon,
      text,
      disabled,
      small,
      alignIcon,
      frameless,
      selected,
      tabIndex: tabIndexProps,
      loadTooltip,
      className: classNameFromButton,
      loading,
      loadingLabel,
      errorLabel,
      successLabel,
      tooltipLabel,
      ...rest
    } = this.props;

    let className = 'g-button';
    const tabIndex = {};

    if ((alignIcon === 'right') && icon && text) {
      className += ' g-button--reverse';
    }

    if (small) {
      className += ' g-button--small';
    }

    if (primary) {
      className += ' g-button--primary';
    }

    if (text && icon) {
      className += ' g-button--icon-and-text';
    }

    if (frameless) {
      className += ' g-button--frameless';
    }

    if (disabled) {
      className += ' g-button--disabled';
      tabIndex.tabIndex = '-1';
    }

    if (tabIndexProps) {
      tabIndex.tabIndex = tabIndexProps;
    }

    if (loading) {
      className += ' g-button--loading';
    }

    if (errorLabel) {
      className += ' g-button--result g-button--error';
    }

    if (successLabel) {
      className += ' g-button--result g-button--success';
    }

    if (selected) {
      className += ' g-button--selected';
    }

    if (classNameFromButton && typeof classNameFromButton === 'string') {
      className += ` ${classNameFromButton}`;
    }

    const loaderSize = small ? 28 : 34;

    return (
      <a
        ref="button"
        className={className}
        {...rest}
        onClick={this.onClick}
        {...tabIndex}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        {this.renderIcon()}
        {this.renderText()}
        {this.renderResultState()}
        <div className="g-button__loader">
          <RotateLoader size={loaderSize} />
        </div>
      </a>
    );
  }
}

const { string, bool, func } = PropTypes;

Button.propTypes = {
  onClick: func,
  errorLabel: string,
  successLabel: string,
  className: string,
  primary: bool,
  icon: string,
  text: string,
  small: bool,
  alignIcon: string,
  disabled: bool,
  loading: bool,
  frameless: bool,
};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
  loadTooltip: tooltip,
})(Button);
