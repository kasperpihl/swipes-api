import React from 'react';
import { element } from 'react-swiss';
import sw from './PostHeader.swiss';
import HOCAssigning from 'components/assigning/HOCAssigning';
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
    children,
  } = props;

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
        <Subtitle>posted to Tisho and Kasper - 2min ago</Subtitle>
        {children}
      </RightSide>
    </PostHeaderWrapper>
  )
};

export default PostHeader;