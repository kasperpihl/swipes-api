import React from 'react';
import PropTypes from 'prop-types';
import SW from './CardHeader.swiss';
import CardHeaderSubtitle from './Subtitle/CardHeaderSubtitle';
import CardHeaderPicker from './Picker/CardHeaderPicker';

import Spacing from '_shared/Spacing/Spacing';

CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  teamPicker: PropTypes.bool,
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
  separator,
  onTitleClick,
  showUnreadCounter,
  teamPicker,
  children,
  ...rest
}) {
  return (
    <SW.Wrapper separator={separator} {...rest}>
      <SW.ContentWrapper noSubtitle={!subtitle} hasTeamPicker={!!teamPicker}>
        <SW.TitleWrapper>
          <SW.Title
            key="header-title"
            onClick={onTitleClick}
            hasClickHandler={!!onTitleClick}
          >
            {title}
          </SW.Title>
          {teamPicker && (
            <CardHeaderPicker showUnreadCounter={showUnreadCounter} />
          )}
        </SW.TitleWrapper>

        {subtitle && !teamPicker && (
          <CardHeaderSubtitle subtitle={subtitle} children={children} />
        )}
        {!subtitle && <SW.Actions>{children}</SW.Actions>}
      </SW.ContentWrapper>
      {separator && <Spacing height={6} />}
    </SW.Wrapper>
  );
}
