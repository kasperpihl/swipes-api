import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/react/_components/Button/Icon/ButtonIcon';
import buttonParseStatus from 'src/utils/button/buttonParseStatus';
import buttonParseTitle from 'src/utils/button/buttonParseTitle';
import SW from './Button.swiss';

export default class Button extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    title: PropTypes.string,
    status: PropTypes.shape({
      loading: PropTypes.string,
      success: PropTypes.string,
      error: PropTypes.string
    })
  };
  render() {
    const {
      icon,
      title,
      status,
      className,
      onClick,
      border,
      ...rest
    } = this.props;
    const parsedStatus = buttonParseStatus(status);
    const parsedTitle = buttonParseTitle(title, status);
    let parsedClassName = 'button-icon-js';
    if (className) {
      parsedClassName = `${parsedClassName} ${className}`;
    }
    return (
      <SW.ProvideContext
        hasIcon={!!(icon || parsedStatus !== 'Standard')}
        status={parsedStatus}
        border={border}
      >
        <SW.Wrapper
          {...rest}
          onClick={(parsedStatus === 'Standard' && onClick) || undefined}
          className={parsedClassName}
        >
          <ButtonIcon icon={icon} status={parsedStatus} />
          {!!parsedTitle && <SW.Title>{parsedTitle}</SW.Title>}
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
