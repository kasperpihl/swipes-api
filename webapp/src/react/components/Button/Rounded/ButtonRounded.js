import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/react/components/Button/Icon/ButtonIcon';
import buttonParseStatus from 'src/utils/button/buttonParseStatus';
import buttonParseTitle from 'src/utils/button/buttonParseTitle';
import SW from './ButtonRounded.swiss';

export default class ButtonRounded extends PureComponent {
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
    const parsedTitle = buttonParseTitle(title, status);
    return (
      <SW.ProvideContext rounded status={buttonParseStatus(status)}>
        <SW.Wrapper {...rest}>
          <ButtonIcon {...this.props} />
          {!!parsedTitle && <SW.Title>{parsedTitle}</SW.Title>}
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}
