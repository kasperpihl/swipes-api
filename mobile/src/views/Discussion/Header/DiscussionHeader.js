import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Keyboard, ActivityIndicator, Platform } from 'react-native';
import { fromJS } from 'immutable';
import RippleButton from 'RippleButton';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { bindAll } from 'swipes-core-js/classes/utils';
import SplitImage from 'components/SplitImage/SplitImage';
import { colors } from 'utils/globalStyles';
import SW from './DiscussionHeader.swiss';

@connect(state => ({
  myId: state.me.get('id'),
}), {
  actionModal: a.modals.action,
  promptModal: a.modals.prompt,
  request: ca.api.request,
})
export default class DiscussionHeader extends PureComponent {
  constructor(props) {
    super(props);

    bindAll(this, [
      'onHeaderPressed',
      'onItemPress'
    ]);
  }
  onHeaderPressed() {
    const { followers, myId, actionModal } = this.props;
    const followLabel = followers.find((f) => f.user_id === myId) ? 'Unfollow' : 'Follow';

    Keyboard.dismiss();
    actionModal({
      title: null,
      onItemPress: this.onItemPress,
      items: fromJS([
        { id: 'rename', title: 'Rename discussion' },
        { id: 'follow', title: `${followLabel} discussion` },
      ]),
    }, { onDidClose: ()=>{ /*do something on close*/ } });
  }
  onItemPress(itemId) {
    const { id, promptModal, setLoading, clearLoading, followers, myId, request } = this.props;

    if (itemId === 'rename') {
      promptModal({
        title: 'Rename discussion',
        placeholder: 'New topic',
        keyboardType: '',
        onConfirmPress: (e, text) => {
          setLoading('changingSettings');

          request('discussion.rename', {
            discussion_id: id,
            topic: text,
          }).then((res) => {
            clearLoading('changingSettings');
      
            if (res.ok) {
              window.analytics.sendEvent('Topic renamed', {});
            }
          })
        },
        onClose: () => {},
      })
    }

    if (itemId === 'follow') {
      const followEndpoint = followers.find((f) => f.user_id === myId) ? 'discussion.unfollow' : 'discussion.follow';
      setLoading('changingSettings');

      request(followEndpoint, {
        discussion_id: id,
      }).then((res) => {
        clearLoading('changingSettings');
  
        if (res.ok) {
          window.analytics.sendEvent('Discussion followed/unfollowed', {});
        }
      }) 
    }
  }
  render() {
    const { followers, topic, isLoading, last_two_comments_by } = this.props;
    const followersLabel = followers.length > 1 ? 'followers' : 'follower';
    const isAndroid = Platform.OS === 'android';

    return (
      <RippleButton onPress={this.onHeaderPressed}>
        <SW.Wrapper isAndroid={isAndroid}>
          <SW.LeftSide>
            <SplitImage userIds={last_two_comments_by} size={40} />
          </SW.LeftSide>
          <SW.MiddleSide>
            <SW.LineOfText numberOfLines={1} topic>
              {topic}
            </SW.LineOfText>
            <SW.LineOfText numberOfLines={1}>
              {followers.length} {followersLabel}
            </SW.LineOfText>
          </SW.MiddleSide>
          <SW.RightSide>
            {isLoading('changingSettings') ? <ActivityIndicator color={colors.blue100} /> : <SW.ArrowRight icon="ArrowRightLine" fill={colors.blue} />}
          </SW.RightSide>
        </SW.Wrapper>
      </RippleButton>
    );
  }
}
