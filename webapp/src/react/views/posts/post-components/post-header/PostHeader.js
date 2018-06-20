import React from 'react';
import { styleElement } from 'swiss-react';
import styles from './PostHeader.swiss';
import HOCAssigning from 'components/assigning/HOCAssigning';
import TimeAgo from 'swipes-core-js/components/TimeAgo';

const Wrapper = styleElement('div', styles.Wrapper);
const NameWrapper = styleElement('div', styles.NameWrapper);
const NameTitle = styleElement('div', styles.NameTitle);
const Subtitle = styleElement('div', styles.Subtitle);
const LeftSide = styleElement('div', styles.LeftSide);
const RightSide = styleElement('div', styles.RightSide);

const PostHeader = (props) => {
  const {
    post,
    onSubtitleClick,
    children,
  } = props;

  let subtitle = '';

  if(post.get('tagged_users') && post.get('tagged_users').size) {
    subtitle = 'tagged';

    let names = msgGen.users.getNames(post.get('tagged_users'), {
      number: 100,
    });

    subtitle += ` ${names} - `;
  }

  return (
    <Wrapper>
      <LeftSide>
        <HOCAssigning assignees={[post.get('created_by')]} size={42} />
      </LeftSide>
      <RightSide>
        <NameWrapper>
          <NameTitle>{msgGen.users.getFullName(post.get('created_by'))}</NameTitle>
        </NameWrapper>
        <Subtitle clickable={!!onSubtitleClick} onClick={onSubtitleClick}>
          {subtitle}
          <TimeAgo simple date={post.get('created_at')}
        /></Subtitle>
        {children}
      </RightSide>
    </Wrapper>
  )
};

export default PostHeader;
