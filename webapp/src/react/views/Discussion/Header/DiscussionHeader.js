import React, { PureComponent, Fragment } from 'react';
import SW from './DiscussionHeader.swiss';
import SplitImage from 'src/react/components/split-image/SplitImage';
import InfoButton from 'src/react/components/info-button/InfoButton';
import Button from 'src/react/components/button/Button';
import PostAttachment from 'src/react/views/posts/post-components/post-attachment/PostAttachment';

const users = ['URU3EUPOE', 'UFXDWRVSU', 'UB9BXJ1JB'];

export default class DiscussionHeader extends PureComponent {
  getInfoTabProps() {
    return {
      actions: [
        { title: 'Load a way', icon: 'Download' },
        { title: 'Save as a way', icon: 'Save' },
        { title: 'Delete goal', icon: 'Delete', danger: true },
      ],
      about: {
        title: 'What is a goal',
        text: 'A Goal is where work happens. Something needs to be done or delivered. Goals can be broken down into steps to show the next action.\n\nAll important links, documents, and notes can be attached to the goal so everyone is on the same page. You can discuss a goal or post an update via "Discuss".',
      },
    };
  }
  render() {
    return (
      <Fragment>
        <SW.Wrapper>
          <SplitImage size={48} users={users} />
          <SW.TitleWrapper>
            <SW.Title>Design Discussion</SW.Title>
            <SW.Subtitle>Public - 6 followers</SW.Subtitle>
          </SW.TitleWrapper>
          <SW.Actions>
            <Button 
              title="Follow"
            />
            <InfoButton
              delegate={this}
            />
          </SW.Actions>
        </SW.Wrapper>
        <SW.ContextWrapper>
          <PostAttachment
            title="Design note"
            icon="Note"
          />
        </SW.ContextWrapper>
      </Fragment>
    );
  }
}
