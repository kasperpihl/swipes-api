import React, { PureComponent } from 'react';
import { TouchableHighlight } from 'react-native';
import SW from './DiscussionListItem.swiss';

export default class DiscussionListItem extends PureComponent {
  onTap = () => {
    const { navPush, discussion } = this.props;
    const overview = {
      id: 'DiscussionOverview',
      title: 'Discussion overview',
      props: {
        discussionId: discussion.id,
      },
    };
    navPush(overview);
  }
  render() {
    const { discussion } = this.props;
    return (
      <TouchableHighlight onPress={this.onTap}>
        <SW.Wrapper >
          {discussion.topic}
        </SW.Wrapper>
      </TouchableHighlight>
    );
  }
}
