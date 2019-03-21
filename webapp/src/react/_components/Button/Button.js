import React from 'react';
import PropTypes from 'prop-types';
import ButtonIcon from 'src/react/_components/Button/Icon/ButtonIcon';
import buttonParseStatus from 'src/utils/button/buttonParseStatus';
import buttonParseTitle from 'src/utils/button/buttonParseTitle';
import SW from './Button.swiss';

Button.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  status: PropTypes.shape({
    loading: PropTypes.string,
    success: PropTypes.string,
    error: PropTypes.string
  }),
  green: PropTypes.bool
};

export default function Button({
  icon,
  title,
  status,
  onClick,
  selected,
  small,
  green,
  ...rest
}) {
  const parsedStatus = buttonParseStatus(status);
  const parsedTitle = buttonParseTitle(title, status);

  return (
    <SW.ProvideContext
      hasIcon={!!(icon || parsedStatus !== 'Standard')}
      status={parsedStatus}
      selected={selected}
      small={small}
      withTitle={!!parsedTitle}
      green={green}
      border={!(icon || parsedStatus !== 'Standard') && !!parsedTitle}
    >
      <SW.Wrapper
        {...rest}
        onClick={(parsedStatus === 'Standard' && onClick) || undefined}
      >
        <ButtonIcon icon={icon} status={parsedStatus} />
        {!!parsedTitle && <SW.Title>{parsedTitle}</SW.Title>}
      </SW.Wrapper>
    </SW.ProvideContext>
  );
}
