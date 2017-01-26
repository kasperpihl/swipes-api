import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';
import Button from 'Button';
import { setupCachedCallback } from 'classes/utils';

// now use events as onClick:

class ResultItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onClickCached = setupCachedCallback(this.onClick, this);
  }
  onClick(side, e) {
    const { onClick, disabled } = this.props;

    if (onClick && !disabled) {
      onClick(side, e);
    }
  }
  renderIcon(obj, side) {
    let className = 'result__icon';
    let children;

    if (obj.src) {
      className += ' result__icon--img';
      children = <img src={obj.src} />;
    } else if (obj.icon) {
      className += ' result__icon--svg';
      children = <Icon svg={obj.icon} />;
    } else if (obj.button) {
      className += ' result__icon--btn';
      children = (
        <Button
          {...obj.button}
          onClick={this.onClickCached(side)}
        />
        );
    } else if (obj.label) {
      className += ' result__icon--label';
      children = obj.label;
    } else if (obj.initials) {
      const styles = {};

      if (obj.initials.color) {
        styles.color = obj.initials.color;
      }

      if (obj.initials.backgroundColor) {
        styles.backgroundColor = obj.initials.backgroundColor;
      }

      className += ' result__icon--initials';
      children = <div className="result__initials" style={styles}>{obj.initials.letters}</div>;
    }

    className += ` result__icon--${side}`;

    return (
      <div className={className}>
        {children}
      </div>
    );
  }
  renderLeftIcon() {
    const { leftIcon } = this.props;

    if (!leftIcon) {
      return undefined;
    }

    return this.renderIcon(leftIcon, 'left');
  }
  renderRightIcon() {
    const { rightIcon } = this.props;

    if (!rightIcon) {
      return undefined;
    }

    return this.renderIcon(rightIcon, 'right');
  }
  renderTitle() {
    const { title } = this.props;

    if (!title) {
      return undefined;
    }

    return <div className="result__title">{title}</div>;
  }
  renderSubtitle() {
    const { subtitle } = this.props;

    if (!subtitle) {
      return undefined;
    }

    return <div className="result__subtitle">{subtitle}</div>;
  }
  render() {
    const { disabled } = this.props;
    let className = 'result';

    if (disabled) {
      className += ' result--disabled';
    }

    return (
      <div className={className} onClick={this.onClickCached('row')}>
        {this.renderLeftIcon()}
        <div className="result__data">
          {this.renderTitle()}
          {this.renderSubtitle()}
        </div>
        {this.renderRightIcon()}
      </div>
    );
  }
}

const { shape, string, func, object, bool } = PropTypes;

const iconProps = shape({
  src: string,
  icon: string,
  button: shape({
    icon: string,
    hoverIcon: string,
  }),
  label: string,
  initials: shape({
    letters: string,
    color: string,
    backgroundColor: string,
  }),
});

ResultItem.propTypes = {
  delegate: object,
  onClick: func,
  leftIcon: iconProps,
  title: string,
  subtitle: string,
  rightIcon: iconProps,
  disabled: bool,
};

export default ResultItem;
