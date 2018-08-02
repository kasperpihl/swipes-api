import React, { PureComponent, Fragment } from 'react';
import {
  setupLoading,
  miniIconForId,
  navForContext,
} from 'swipes-core-js/classes/utils';
import { connect } from 'react-redux';
import * as menuActions from 'src/redux/menu/menuActions';
import * as navigationActions from 'src/redux/navigation/navigationActions';
import * as ca from 'swipes-core-js/actions';
import SW from './DiscussionHeader.swiss';
import SplitImage from 'src/react/components/split-image/SplitImage';
import Button from 'src/react/components/button/Button';
import PostAttachment from 'src/react/views/posts/post-components/post-attachment/PostAttachment';
import navWrapper from 'src/react/app/view-controller/NavWrapper';

@navWrapper
@connect(state => ({
  myId: state.me.get('id'),
}), {
  inputMenu: menuActions.input,
  openSecondary: navigationActions.openSecondary,
  request: ca.api.request,
})
export default class DiscussionHeader extends PureComponent {
  constructor(props){
    super(props);

    setupLoading(this);
  }
  onTitleClick = (e) => {
    const { inputMenu, discussion, request } = this.props;

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
  onContextClick = () => {
    const { openSecondary, discussion, target } = this.props;
    openSecondary(target, navForContext(discussion.get('context')));
  }
  onFollowClick = () => {
    const { request, myId, discussion } = this.props

    this.setLoading('following');
    let endpoint = 'discussion.follow';
    if(discussion.get('followers').find(o => o.get('user_id') === myId)) {
      endpoint = 'discussion.unfollow';
    }
    request(endpoint, {
      discussion_id: discussion.get('id'),
    }).then((res) => {
      this.clearLoading('following');
    })
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
            <SW.Title 
              hasTopic={!!discussion.get('topic_set')} 
              onClick={this.onTitleClick}>
              {topic}
            </SW.Title>
            <SW.Subtitle>{privacy} - {followers.size} {followers.size === 1 ? 'follower' : 'followers'}</SW.Subtitle>
          </SW.TitleWrapper>
          <SW.Actions>
            {!discussion.get('topic_set') && (
              <Button
                title="Set topic"
                onClick={this.onTitleClick}
              />
            )}
            <Button
              title={followers.includes(myId) ? 'Unfollow' : 'Follow'}
              onClick={this.onFollowClick}
              {...this.getLoading('following')}
            />
          </SW.Actions>
        </SW.Wrapper>
        {discussion.get('context') && (
          <SW.ContextWrapper>
            <PostAttachment
              icon={miniIconForId(discussion.getIn(['context', 'id']))}
              title={discussion.getIn(['context', 'title'])}
              onClick={this.onContextClick}
              isContext
            />
          </SW.ContextWrapper>
        )}
        
      </Fragment>
    );
  }
}
