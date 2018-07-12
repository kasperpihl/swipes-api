import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { setupCachedCallback } from 'react-delegate';
import SW from './ResultItem.swiss';

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
      e.stopPropagation();
      onClick(side, e);
    }
  }
  renderIcon(obj, side) {
    let className = '';
    let children;

    if (obj.src) {
      className += 'img';
      children = <SW.Image role="presentation" src={obj.src} />;
    } else if (obj.icon) {
      className += 'svg';
      children = <SW.Icon {...obj} />;
    } else if (obj.button) {
      className += 'btn';
      children = (
        <SW.Button
          {...obj.button}
          onClick={this.onClickCached(side)}
        />
        );
    } else if (obj.label) {
      className += 'label';
      children = obj.label;
    } else if (obj.initials) {
      className += 'initials';
      children = <SW.Initials>{obj.initials.letters}</SW.Initials>;
    }

    className += ` ${side}`;

    return (
      <SW.IconWrapper className={className}>
        {children}
      </SW.IconWrapper>
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

    return <SW.Title className='title'>{title}</SW.Title>;
  }
  renderSubtitle() {
    const { subtitle } = this.props;

    if (!subtitle) {
      return undefined;
    }

    return <SW.Subtitle className='subtitle'>{subtitle}</SW.Subtitle>;
  }
  render() {
    const { disabled, selected, onMouseDown } = this.props;
    let className = '';

    if (disabled) {
      className += ' disabled';
    }

    if (selected) {
      className += ' selected';
    }

    return (
      <SW.Wrapper
      className={className}
      onMouseDown={onMouseDown}
      onClick={this.onClickCached('row')}>
        {this.renderLeftIcon()}
        <SW.Data className='data'>
          {this.renderTitle()}
          {this.renderSubtitle()}
        </SW.Data>
        {this.renderRightIcon()}
      </SW.Wrapper>
    );
  }
}

const { shape, string, func, bool } = PropTypes;

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
  disabled: bool,
  selected: bool,
};

export default ResultItem;
