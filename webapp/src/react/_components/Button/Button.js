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
  green: PropTypes.bool,
  disabled: PropTypes.bool
};

export default function Button({
  icon,
  title,
  status,
  onClick,
  selected,
  green,
  small,
  children,
  ...rest
}) {
  const parsedStatus = buttonParseStatus(status);
  const parsedTitle = buttonParseTitle(title, status);

  return (
    <SW.ProvideContext
      hasIcon={!!(icon || parsedStatus !== 'Standard')}
      status={parsedStatus}
      selected={selected}
      green={green}
      small={small}
      withTitle={!!parsedTitle}
    >
      <SW.Wrapper
        {...rest}
        onClick={(parsedStatus === 'Standard' && onClick) || undefined}
      >
        {children ? (
          children
        ) : (
          <>
            <ButtonIcon icon={icon} status={parsedStatus} selected={selected} />
            {!!parsedTitle && <SW.Title>{parsedTitle}</SW.Title>}
          </>
        )}
      </SW.Wrapper>
    </SW.ProvideContext>
  );
}
