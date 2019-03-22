import React, { Fragment } from 'react';
import UserImage from 'src/react/_components/UserImage/UserImage';
import SW from './Assignees.swiss';

export default function Assignees(props) {
  let { organizationId, userIds, maxImages, size, onClick, children } = props;

  maxImages = maxImages || 3;
  size = size || 24;

  const userCount = userIds.size || 0;
  const imageCount = Math.min(userCount, maxImages);
  const extraNumber = Math.max(userCount - maxImages, 0);

  if (!userCount) {
    return children || null;
  }

  return (
    <SW.ProvideContext size={size} imageCount={imageCount}>
      <SW.Wrapper onClick={onClick}>
        <SW.AbsoluteWrapper>
          {userIds.map((userId, i) =>
            i < maxImages ? (
              <Fragment key={i}>
                <SW.WhiteBackground index={i} />
                <SW.ImageWrapper index={i}>
                  <UserImage
                    userId={userId}
                    organizationId={organizationId}
                    size={size}
                  />
                </SW.ImageWrapper>
              </Fragment>
            ) : null
          )}
        </SW.AbsoluteWrapper>

        {!!extraNumber && <SW.ExtraNumber>+{extraNumber}</SW.ExtraNumber>}
      </SW.Wrapper>
    </SW.ProvideContext>
  );
}
