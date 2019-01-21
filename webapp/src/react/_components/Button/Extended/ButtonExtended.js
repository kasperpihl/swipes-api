import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/react/_components/Button/Icon/ButtonIcon';
import buttonParseStatus from 'src/utils/button/buttonParseStatus';
import buttonParseTitle from 'src/utils/button/buttonParseTitle';
import SW from './ButtonExtended.swiss';

export default class ButtonExtended extends PureComponent {
  static propTypes = {
    icon: PropTypes.string.isRequired,
    bigTitle: PropTypes.string.isRequired,
    smallTitle: PropTypes.string.isRequired,
    status: PropTypes.shape({
      loading: PropTypes.string,
      success: PropTypes.string,
      error: PropTypes.string
    })
  };

  render() {
    const {
      icon,
      bigTitle,
      smallTitle,
      status,
      className,
      onClick,
      ...rest
    } = this.props;
    const parsedStatus = buttonParseStatus(status);
    const parsedTitleLarge = buttonParseTitle(bigTitle, status);
    let parsedClassName = 'button-icon-js';
    if (className) {
      parsedClassName = `${parsedClassName} ${className}`;
    }

    return (
      <SW.ProvideContext
        extended
        hasIcon={!!(icon || parsedStatus !== 'Standard')}
        status={buttonParseStatus(status)}
      >
        <SW.Wrapper
          {...rest}
          onClick={(parsedStatus === 'Standard' && onClick) || undefined}
          className={parsedClassName}
        >
          <SW.InnerWrapper>
            <ButtonIcon icon={icon} status={parsedStatus} />
          </SW.InnerWrapper>
          <SW.OuterText>
            <SW.BigTitle>{parsedTitleLarge}</SW.BigTitle>
            {(parsedStatus === 'Standard' || parsedStatus === 'Loading') && (
              <SW.SmallTitle>{smallTitle}</SW.SmallTitle>
            )}
          </SW.OuterText>
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
