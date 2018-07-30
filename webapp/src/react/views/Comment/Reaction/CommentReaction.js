import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import { withOptimist } from 'react-optimist';
import AssigneeTooltip from 'src/react/components/assigning/AssigneeTooltip';
import SW from './CommentReaction.swiss';

@withOptimist
@connect(state => ({
  myId: state.me.get('id'),
}), {
  successGradient: mainActions.successGradient,
  tooltip: mainActions.tooltip,
  request: ca.api.request,
})
export default class CommentReaction extends PureComponent {
  constructor(props) {
    super(props);
    props.optimist.identify(props.commentId);
    this.state = {};
  }
  componentWillMount() {
    this.size = this.props.reactions.size;
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.reactions !== this.props.reactions) {
      this.size = nextProps.reactions.size;
    }
  }
  componentWillUnmount() {
    clearTimeout(this.tooltipDelay);
  }
  doILike = () => {
    const { optimist, reactions, myId } = this.props;
    return optimist.get('like', !!reactions.get(myId));
  }
  onReaction = () => {
    const {
      optimist,
      commentId,
      request,
      successGradient,
    } = this.props;

    successGradient('red');
    optimist.set({
      key: 'like',
      value: !this.doILike(),
      handler: (next) => {
        request('comment.react', {
          reaction: this.doILike() ? 'like' : null,
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
    if (!this.size) {
      return;
    }

    const target = e.target.getBoundingClientRect();
    this.tooltipDelay = setTimeout(() => {
      const { tooltip, reactions } = this.props;
      const position = 'top';
      const userIds = reactions.keySeq().toArray();
      

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
  renderButton() {
    const { alignRight } = this.props;

    return (
      <SW.HeartButton alignRight={!!alignRight} className="heart-button" onClick={this.onReaction}>
        <SW.HeartSvg icon="Heart" liked={this.doILike()}/>
      </SW.HeartButton>
    )
  }
  renderString() {
    return (
      <SW.LikeString
        show={!!this.size}
        liked={this.doILike()}>
        {this.size}
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
