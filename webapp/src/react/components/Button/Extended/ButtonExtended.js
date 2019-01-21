import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/react/components/Button/Icon/ButtonIcon';
import buttonParseStatus from 'src/utils/button/buttonParseStatus';
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
    const { icon, status, bigTitle, smallTitle, ...rest } = this.props;

    return (
      <SW.ProvideContext extended status={buttonParseStatus(status)}>
        <SW.Wrapper {...rest}>
          <SW.InnerWrapper>
            <ButtonIcon icon={icon} status={status} />
          </SW.InnerWrapper>
          <SW.OuterText>
            <SW.BigTitle>{bigTitle}</SW.BigTitle>
            <SW.SmallTitle>{smallTitle}</SW.SmallTitle>
          </SW.OuterText>
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
