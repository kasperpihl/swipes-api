import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import { withOptimist } from 'react-optimist';
import AssigneeTooltip from 'src/react/components/assigning/AssigneeTooltip';
import SW from './PostReactions.swiss';

@withOptimist
@connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  successGradient: mainActions.successGradient,
  tooltip: mainActions.tooltip,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction,
})
export default class extends PureComponent {
  constructor(props) {
    super(props);
    props.optimist.identify(`${props.postId}${props.commentId || ''}`);
    this.state = {};
  }
  componentWillMount() {
    this.updateILike(this.props.reactions);
  }
  componentWillReceiveProps(nextProps) {
    this.updateILike(nextProps.reactions);
  }
  componentWillUnmount() {
    clearTimeout(this.tooltipDelay);
  }
  onAddReaction = () => {
    const {
      optimist,
      postId,
      commentId,
      addReaction,
      commentAddReaction,
      successGradient,
    } = this.props;
    const runFunc = commentId ? commentAddReaction : addReaction;

    successGradient('red');
    optimist.set({
      key: 'like',
      value: true,
      handler: (next) => {
        runFunc({
          post_id: postId,
          reaction: 'like',
          comment_id: commentId || null,
        }).then((res) => {
          next();
          if (res.ok) {
            window.analytics.sendEvent('Reaction added', {
              Where: commentId ? 'Comment' : 'Post',
            });
          }
        });
      }
    });
    
  }
  onRemoveReaction = () => {
    const {
      optimist,
      postId,
      commentId,
      removeReaction,
      commentRemoveReaction,
    } = this.props;
    const runFunc = commentId ? commentRemoveReaction : removeReaction;

    optimist.set({
      key: 'like',
      value: true,
      handler: (next) => {
        runFunc({
          post_id: postId,
          comment_id: commentId,
        }).then((res) => {
          next();
          if (res.ok) {
            window.analytics.sendEvent('Reaction removed', {
              Where: commentId ? 'Comment' : 'Post',
            });
          }
        });
      }
    });
  }
  onEnter = (e) => {
    const { reactions } = this.props;

    if (!reactions || !reactions.size) {
      return;
    }

    const target = e.target.getBoundingClientRect();
    this.tooltipDelay = setTimeout(() => {
      const { tooltip, reactions } = this.props;
      const position = 'top';
      const userIds = reactions.map(r => r.get('created_by'));

      const data = {
        component: AssigneeTooltip,
        props: {
          assignees: userIds,
        },
        options: {
          boundingRect: target,
          position,
        },
      };

      tooltip(data);
    }, 200);
  }
  onLeave = () => {
    const { tooltip } = this.props;

    clearTimeout(this.tooltipDelay);
    tooltip(null);
  }
  updateILike(nextReactions) {
    const { reactions, myId } = this.props;

    if (reactions !== nextReactions) {
      const newILike = !!nextReactions.find(r => r.get('created_by') === myId);
      if (this.state.iLike !== newILike) {
        this.setState({ iLike: newILike });
      }
    }
  }
  renderButton() {
    const { alignRight, optimist } = this.props;
    const iLike = optimist.get('like', this.state.iLike);
    const onClick = iLike ? this.onRemoveReaction : this.onAddReaction;

    return (
      <SW.HeartButton alignRight={!!alignRight} className="heart-button" onClick={onClick}>
        <SW.HeartSvg icon="Heart" liked={iLike}/>
      </SW.HeartButton>
    )
  }
  renderString() {
    const { reactions, optimist } = this.props;
    const iLike = optimist.get('like', this.state.iLike);

    return (
      <SW.LikeString 
        show={reactions && !!reactions.size }
        liked={iLike}>
        {reactions && reactions.size}
      </SW.LikeString>
    )
  }
  
  render() {
    const { alignRight } = this.props;

    return (
      <SW.Container onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        {alignRight ? this.renderString() : this.renderButton()}
        {alignRight ? this.renderButton() : this.renderString()}
      </SW.Container>
    );
  }
}
