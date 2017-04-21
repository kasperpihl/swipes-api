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
import './styles/button.scss';

const MIN_TIME = 1000;
const SUCCESS_TIMER = 3000;

class Button extends PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.state = {
      loading: props.loading || false,
      errorState: false,
      successState: false,
    };

    bindAll(this, ['onMouseEnter', 'onMouseLeave']);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading) {
      if (nextProps.loading) {
        this._loadTime = new Date().getTime();
        this.setState({ loading: nextProps.loading });
        clearTimeout(this._timer);
      } else {
        const nowTime = new Date().getTime();
        const diff = (nowTime - this._loadTime);
        if (diff < MIN_TIME) {
          this._timer = setTimeout(() => {
            this.setState({ loading: false });
          }, MIN_TIME - diff);
        } else {
          this.setState({ loading: nextProps.loading });
        }
      }
    }

    if (nextProps.errorLabel !== this.props.errorLabel) {
      this.setState({ errorState: !!nextProps.errorLabel });
      clearTimeout(this._resultTimer);

      this._resultTimer = setTimeout(() => {
        this.setState({ errorState: false });
      }, SUCCESS_TIMER);
    }

    if (nextProps.successLabel !== this.props.successLabel) {
      this.setState({ successState: !!nextProps.successLabel });
      clearTimeout(this._resultTimer);

      this._resultTimer = setTimeout(() => {
        this.setState({ successState: false });
      }, SUCCESS_TIMER);
    }
  }
  componentWillUnmount() {
    clearTimeout(this._timer);
    clearTimeout(this._resultTimer);
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
        tooltipLabel,
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
    const { errorState, successState } = this.state;
    let label = '';
    let icon = '';

    if (!successState && !errorState) {
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
      loading: ldr,
      ...rest
    } = this.props;
    const { loading, errorState, successState } = this.state;
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

    if (errorState) {
      className += ' g-button--result g-button--error';
    }

    if (successState) {
      className += ' g-button--result g-button--success';
    }

    if (selected) {
      className += ' g-button--selected';
    }

    if (classNameFromButton && typeof classNameFromButton === 'string') {
      className += ` ${classNameFromButton}`;
    }

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
