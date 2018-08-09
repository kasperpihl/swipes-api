import React, { PureComponent } from 'react';
import { TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'Icon';
import { colors } from 'globalStyles';
import * as ca from 'swipes-core-js/actions';
import SW from './Reactions.swiss';

@connect(state => ({
  myId: state.me.get('id'),
}), {
  request: ca.api.request,
})
class HOCReactions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleLike = this.handleLike.bind(this);
  }
  componentWillMount() {
    this.updateILike(this.props.reactions);
  }
  componentWillReceiveProps(nextProps) {
    this.updateILike(nextProps.reactions);
  }
  handleLike() {
    const { commentId, request } = this.props;
    const { iLike } = this.state;

    request('comment.react', {
      reaction: !iLike ? 'like' : null,
      comment_id: commentId,
    }).then((res) => {
      if (res.ok) {
        window.analytics.sendEvent('Reaction added', {
          Where: 'Comment',
        });
      }
    });
  }
  updateILike(nextReactions) {
    const { reactions, myId } = this.props;
    const { iLike } = this.state;

    if (typeof iLike === 'undefined' || reactions !== nextReactions) {
      const newILike = !!Object.keys(nextReactions).find(r => r === myId);

      if (iLike !== newILike) {
        this.setState({ iLike: newILike });
      }
    }
  }
  renderButton() {
    const { iLike } = this.state;
    const heartFill = iLike ? colors.red80 : 'transparent';
    const heartStroke = iLike ? colors.red80 : colors.deepBlue40;

    return (
      <SW.LikeButton>
        <Icon icon="Heart" width="24" height="24" fill={heartFill} stroke={heartStroke} />
      </SW.LikeButton>
    );
  }
  renderLikers() {
    const { reactions } = this.props;
    const { iLike } = this.state;
    const size = Object.keys(reactions).length;

    if (!size) {
      return undefined;
    }

    const likeString = `${size}`;

    return (
      <SW.LikeButtonLabel selectable iLike={iLike}>
        {likeString}
      </SW.LikeButtonLabel>
    );
  }
  render() {
    const { children} = this.props;

    return (
      <TouchableOpacity onPress={this.handleLike}>
        <SW.Container>
          {this.renderLikers()}
          {this.renderButton()}
          {children}
        </SW.Container>
      </TouchableOpacity>
    );
  }
}

export default HOCReactions;
