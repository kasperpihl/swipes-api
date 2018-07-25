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

const users = ['URU3EUPOE', 'UFXDWRVSU', 'UB9BXJ1JB'];

@connect(state => ({
  myId: state.getIn(['me', 'id']),
  orgId: state.getIn(['me', 'organizations', 0, 'id']),
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
    const { inputMenu, topic, id, orgId, request } = this.props;

    this.setLoading('title', 'Renaming')
    inputMenu({
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'right',
      text: topic,
      buttonLabel: 'Rename',
    }, (text) => {
      if (text !== topic && text.length) {
        request('discussion.rename', {
          organization_id: orgId,
          discussion_id: id,
          topic: text,
        }).then(res => {
          if(res.ok) {
            console.log('Renamed Discussion')
          }
        })
      } else {
        console.log('Error renaming discussion')
      }
    })
  }
  onFollowClick = () => {
    const { id, request, followers, myId } = this.props

    if(followers.includes(myId)) {
      request('discussion.unfollow',{
        discussion_id: id,
      }).then(res => {
        if(res.ok) {
          console.log('Post Unfollowed')
        }
      })
    } else {
      request('discussion.follow', {
        discussion_id: id,
      }).then(res => {
        if(res.ok) {
          console.log('Post Followed')
        }
      })
    }
  }
  render() {
    const { followers, privacy, topic, myId } = this.props
    const followersArr = followers.toJS()
    return (
      <Fragment>
        <SW.Wrapper>
          <SplitImage size={48} users={followersArr} />
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
