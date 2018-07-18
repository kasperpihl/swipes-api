import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import { withOptimist } from 'react-optimist';
import AssigneeTooltip from 'src/react/components/assigning/AssigneeTooltip';
import SW from './CommentReaction.swiss';

@withOptimist
@connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  successGradient: mainActions.successGradient,
  tooltip: mainActions.tooltip,
  request: ca.api.request,
})
export default class CommentReaction extends PureComponent {
  constructor(props) {
    super(props);
    props.optimist.identify(`${props.postId}${props.commentId || ''}`);
    this.state = {};
  }
  componentWillMount() {
    this.updateILike();
  }
  componentWillReceiveProps(nextProps) {
    this.updateILike(nextProps.reactions);
  }
  componentWillUnmount() {
    clearTimeout(this.tooltipDelay);
  }
  onReaction = () => {
    const {
      optimist,
      commentId,
      successGradient,
    } = this.props;

    const iLike = optimist.get('like', this.state.iLike);

    successGradient('red');
    optimist.set({
      key: 'like',
      value: true,
      handler: (next) => {
        request('comment.react', {
          reaction: iLike ? null : 'like',
          comment_id: commentId,
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
      const reactionsToUse = nextReactions ? nextReactions : reactions;
      const newILike = !!reactionsToUse.find(r => r.get('created_by') === myId);

      if (this.state.iLike !== newILike) {
        this.setState({ iLike: newILike });
      }
    }
  }
  renderButton() {
    const { alignRight, optimist } = this.props;
    const iLike = optimist.get('like', this.state.iLike);

    return (
      <SW.HeartButton alignRight={!!alignRight} className="heart-button" onClick={this.onReaction}>
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
