import React from 'react';
import PropTypes from 'prop-types';
import SW from './CardHeader.swiss';
import CardHeaderSubtitle from './Subtitle/CardHeaderSubtitle';
import Spacing from '_shared/Spacing/Spacing';

CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.oneOfType([
    PropTypes.shape({
      ownedBy: PropTypes.string.isRequired,
      members: PropTypes.arrayOf(PropTypes.string),
      privacy: PropTypes.oneOf(['public', 'private'])
    }),
    PropTypes.string
  ]),
  separator: PropTypes.bool
};

export default function CardHeader({
  title,
  subtitle,
  dropdown,
  separator,
  onTitleClick,
  children,
  cursorHover,
  ...rest
}) {
  return (
    <SW.Wrapper separator={separator} {...rest} subtitle={!subtitle}>
      <SW.TitleWrapper>
        <SW.Title
          key="header-title"
          onClick={onTitleClick}
          cursorHover={cursorHover}
        >
          {title}
        </SW.Title>
        {dropdown}
      </SW.TitleWrapper>
      {!subtitle && <SW.Actions>{children}</SW.Actions>}
      {subtitle && (
        <CardHeaderSubtitle subtitle={subtitle} children={children} />
      )}
      {separator && <Spacing height={6} />}
    </SW.Wrapper>
  );
}
