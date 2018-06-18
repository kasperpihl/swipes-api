import React from 'react';
import TimeAgo from 'swipes-core-js/components/TimeAgo';
import HOCAssigning from 'components/assigning/HOCAssigning';
import SW from './PostHeader.swiss';

const PostHeader = (props) => {
  const {
    post,
    onSubtitleClick,
    children,
  } = props;

  let subtitle = 'tagged';

  if(post.get('tagged_users') && post.get('tagged_users').size) {
    let names = msgGen.users.getNames(post.get('tagged_users'), {
      number: 100,
    });
    subtitle += ` ${names}`;
  }

  return (
    <SW.Wrapper>
      <SW.LeftSide>
        <HOCAssigning assignees={[post.get('created_by')]} size={42} />
      </SW.LeftSide>
      <SW.RightSide>
        <SW.NameWrapper>
          <SW.NameTitle>{msgGen.users.getFullName(post.get('created_by'))}</SW.NameTitle>
        </SW.NameWrapper>
        <SW.Subtitle clickable={!!onSubtitleClick} onClick={onSubtitleClick}>
          {subtitle} — <TimeAgo simple date={post.get('created_at')}
        /></SW.Subtitle>
        {children}
      </SW.RightSide>
    </SW.Wrapper>
  )
};

export default PostHeader;
