import React, { PureComponent } from 'react'
import SW from './MilestoneResult.swiss';

export default (props) => {
  return (
    <SW.Wrapper>
      <SW.IconWrapper>
        <SW.Icon icon="MiniMilestone"/>
      </SW.IconWrapper>
      <SW.Title className='title'>{props.result.item.title}</SW.Title>
    </SW.Wrapper>
  );
};
