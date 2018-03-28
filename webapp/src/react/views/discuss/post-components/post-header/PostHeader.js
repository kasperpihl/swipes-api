import React from 'react';
import { element } from 'react-swiss';

import sw from './PostHeader.swiss';
import HOCAssigning from 'components/assigning/HOCAssigning';
import TimeAgo from 'swipes-core-js/components/TimeAgo';
import PostType from '../post-type/PostType';

const PostHeaderWrapper = element('div', sw.PostHeaderWrapper);
const NameTypeWrapper = element('div', sw.NameTypeWrapper);
const NameTitle = element('div', sw.NameTitle);
const Subtitle = element('div', sw.Subtitle);
const LeftSide = element('div', sw.LeftSide);
const RightSide = element('div', sw.RightSide);

const PostHeader = (props) => {
  const {
    post,
    onSubtitleClick,
    children,
  } = props;

  let subtitle = 'posted';
  if(post.get('tagged_users') && post.get('tagged_users').size) {
    let names = msgGen.users.getNames(post.get('tagged_users'), {
      number: 100,
    });
    subtitle += ` to ${names}`;
  }

  return (
    <PostHeaderWrapper>
      <LeftSide>
        <HOCAssigning assignees={[post.get('created_by')]} rounded size={42} />
      </LeftSide>
      <RightSide>
        <NameTypeWrapper>
          <NameTitle>{msgGen.users.getFullName(post.get('created_by'))}</NameTitle>
          <PostType type={post.get('type')} />
        </NameTypeWrapper>
        <Subtitle clickable={!!onSubtitleClick} onClick={onSubtitleClick}>
          {subtitle} — <TimeAgo simple date={post.get('created_at')}
        /></Subtitle>
        {children}
      </RightSide>
    </PostHeaderWrapper>
  )
};

export default PostHeader;