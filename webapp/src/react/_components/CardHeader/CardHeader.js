import React from 'react';
import PropTypes from 'prop-types';
import SW from './CardHeader.swiss';
import CardHeaderSubtitle from './Subtitle/CardHeaderSubtitle';

CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.shape({
    ownedBy: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.string).isRequired,
    privacy: PropTypes.oneOf(['public', 'private']).isRequired
  }),
  separator: PropTypes.bool
};

export default function CardHeader({
  title,
  subtitle,
  separator,
  onTitleClick,
  children,
  ...rest
}) {
  return (
    <SW.Wrapper separator={separator} {...rest}>
      <SW.Title key="header-title" onClick={onTitleClick}>
        {title}
      </SW.Title>
      {!subtitle && <SW.Actions>{children}</SW.Actions>}
      {subtitle && <CardHeaderSubtitle {...subtitle} children={children} />}
    </SW.Wrapper>
  );
}
