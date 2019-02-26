import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as mainActions from 'src/redux/main/mainActions';
import { withOptimist } from 'react-optimist';
import request from 'core/utils/request';
import TooltipUsers from 'src/react/_components/TooltipUsers/TooltipUsers';
import SW from './CommentReaction.swiss';

@withOptimist
@connect(
  state => ({
    myId: state.me.get('user_id')
  }),
  {
    successGradient: mainActions.successGradient,
    tooltip: mainActions.tooltip
  }
)
export default class CommentReaction extends PureComponent {
  constructor(props) {
    super(props);
    props.optimist.identify(props.commentId);
  }
  componentWillMount() {
    this.size = Object.keys(this.props.reactions).length;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.reactions !== this.props.reactions) {
      this.size = Object.keys(nextProps.reactions).length;
    }
  }
  componentWillUnmount() {
    clearTimeout(this.tooltipDelay);
  }
  doILike = () => {
    const { optimist, reactions, myId } = this.props;
    return optimist.get('like', !!reactions[myId]);
  };
  onReaction = () => {
    const { optimist, commentId, successGradient, discussionId } = this.props;

    successGradient('red');
    optimist.set({
      key: 'like',
      value: !this.doILike(),
      handler: next => {
        request('comment.react', {
          reaction: this.doILike() ? 'like' : null,
          discussion_id: discussionId,
          comment_id: commentId
        }).then(res => {
          next();
          if (res.ok) {
            window.analytics.sendEvent('Reaction added', {
              Where: commentId ? 'Comment' : 'Post'
            });
          }
        });
      }
    });
  };
  onEnter = e => {
    if (!this.size) {
      return;
    }

    const target = e.target.getBoundingClientRect();
    this.tooltipDelay = setTimeout(() => {
      const { tooltip, reactions, ownedBy } = this.props;
      const position = 'top';
      const userIds = Object.keys(reactions);

      const data = {
        component: TooltipUsers,
        props: {
          userIds,
          organizationId: ownedBy
        },
        options: {
          boundingRect: target,
          position
        }
      };

      tooltip(data);
    }, 200);
  };
  onLeave = () => {
    const { tooltip } = this.props;

    clearTimeout(this.tooltipDelay);
    tooltip(null);
  };

  render() {
    return (
      <SW.Container
        onMouseEnter={this.onEnter}
        onMouseLeave={this.onLeave}
        className={this.props.className}
      >
        <SW.LikeString show={!!this.size} liked={this.doILike()}>
          {this.size}
        </SW.LikeString>
        <SW.HeartButton className="heart-button" onClick={this.onReaction}>
          <SW.HeartSvg icon="Heart" liked={this.doILike()} />
        </SW.HeartButton>
      </SW.Container>
    );
  }
}
