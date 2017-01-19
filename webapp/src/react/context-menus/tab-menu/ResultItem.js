import React, { Component, PropTypes } from 'react';
import Icon from 'Icon';


class ResultItem extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
      children = <Icon svg={obj.button.icon} />;
    } else if (obj.label) {
      className += ' result__icon--label';
      children = obj.label;
    } else if (obj.initials) {
      className += ' result__icon--initials';
      children = obj.initials.letters;
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
    return (
      <div className="result">
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

const { shape, string, func } = PropTypes;

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
  onClick: func,
  leftIcon: iconProps,
  title: string,
  subtitle: string,
  rightIcon: iconProps,
};

export default ResultItem;
