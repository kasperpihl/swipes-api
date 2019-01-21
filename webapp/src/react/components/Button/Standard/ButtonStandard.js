import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/react/components/Button/Icon/ButtonIcon';
import buttonParseStatus from 'src/utils/button/buttonParseStatus';
import buttonParseTitle from 'src/utils/button/buttonParseTitle';
import SW from './ButtonStandard.swiss';

export default class ButtonStandard extends PureComponent {
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
    const { icon, title, status, ...rest } = this.props;
    const parsedStatus = buttonParseStatus(status);
    const parsedTitle = buttonParseTitle(title, status);

    return (
      <SW.ProvideContext
        hasIcon={!!(icon || parsedStatus === 'Standard')}
        status={parsedStatus}
      >
        <SW.Wrapper {...rest} className="button-icon-js">
          <ButtonIcon icon={icon} status={parsedStatus} />
          {!!parsedTitle && <SW.Title>{parsedTitle}</SW.Title>}
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
