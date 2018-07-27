import React, { PureComponent, Fragment } from 'react';
import {
  setupLoading,
} from 'swipes-core-js/classes/utils';
import { connect } from 'react-redux';
import * as menuActions from 'src/redux/menu/menuActions';
import * as ca from 'swipes-core-js/actions';
import SW from './DiscussionHeader.swiss';
import SplitImage from 'src/react/components/split-image/SplitImage';
import InfoButton from 'src/react/components/info-button/InfoButton';
import Button from 'src/react/components/button/Button';
import PostAttachment from 'src/react/views/posts/post-components/post-attachment/PostAttachment';

@connect(state => ({
  myId: state.me.get('id'),
}), {
  inputMenu: menuActions.input,
  request: ca.api.request,
})
export default class DiscussionHeader extends PureComponent {
  constructor(props){
    super(props);

    setupLoading(this);
  }
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
  onTitleClick = (e) => {
    const { inputMenu, discussion, request } = this.props;

    this.setLoading('title', 'Renaming')
    inputMenu({
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      text: discussion.get('topic'),
      buttonLabel: 'Rename',
    }, (text) => {
      if (text !== discussion.get('topic') && text.length) {
        request('discussion.rename', {
          discussion_id: discussion.get('id'),
          topic: text,
        })
      }
    })
  }
  onFollowClick = () => {
    const { request, myId, discussion } = this.props

    if(discussion.get('followers').find(o => o.get('user_id') === myId)) {
      request('discussion.unfollow',{
        discussion_id: discussion.get('id'),
      })
    } else {
      request('discussion.follow', {
        discussion_id: discussion.get('id'),
      })
    }
  }
  render() {
    const { discussion, myId } = this.props;
    const followers = discussion.get('followers').map(o => o.get('user_id'));
    const topic = discussion.get('topic');
    const privacy = discussion.get('privacy');

    return (
      <Fragment>
        <SW.Wrapper>
          <SplitImage size={48} users={followers.toJS()} />
          <SW.TitleWrapper>
            <SW.Title onClick={this.onTitleClick}>{topic}</SW.Title>
            <SW.Subtitle>{privacy} - {followers.size} {followers.size === 1 ? 'follower' : 'followers'}</SW.Subtitle>
          </SW.TitleWrapper>
          <SW.Actions>
            <Button
              title={followers.includes(myId) ? 'Unfollow' : 'Follow'}
              onClick={this.onFollowClick}
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
