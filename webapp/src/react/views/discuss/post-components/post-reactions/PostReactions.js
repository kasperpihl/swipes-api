import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { styleElement } from 'react-swiss';
import * as mainActions from 'src/redux/main/mainActions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate } from 'react-delegate';
import { bindAll } from 'swipes-core-js/classes/utils';
import AssigneeTooltip from 'components/assigning/AssigneeTooltip';
import Icon from 'Icon';
import styles from './PostReactions.swiss';

const Container = styleElement('div', styles.Container);
const HeartButton = styleElement('div', styles.HeartButton);
const HeartSvg = styleElement(Icon, styles.HeartSvg);
const LikeString = styleElement('div', styles.LikeString);

class Reactions extends PureComponent {
  constructor(props) {
    super(props);
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
    const { postId, commentId, addReaction, commentAddReaction, successGradient } = this.props;
    const runFunc = commentId ? commentAddReaction : addReaction;

    successGradient('red');
    this.setState({ iLike: true });
    runFunc({
      post_id: postId,
      reaction: 'like',
      comment_id: commentId || null,
    }).then((res) => {
      if (res.ok) {
        window.analytics.sendEvent('Reaction added', {
          Where: commentId ? 'Comment' : 'Post',
        });
      }
    });
  }
  onRemoveReaction = () => {
    const { postId, commentId, removeReaction, commentRemoveReaction } = this.props;
    const runFunc = commentId ? commentRemoveReaction : removeReaction;

    this.setState({ iLike: false });
    runFunc({
      post_id: postId,
      comment_id: commentId,
    }).then((res) => {
      if (res.ok) {
        window.analytics.sendEvent('Reaction removed', {
          Where: commentId ? 'Comment' : 'Post',
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
    const { iLike } = this.state;

    if (typeof iLike === 'undefined' || reactions !== nextReactions) {
      const newILike = !!nextReactions.find(r => r.get('created_by') === myId);

      if (iLike !== newILike) {
        this.setState({ iLike: newILike });
      }
    }
  }
  renderButton() {
    const { iLike } = this.state;
    const { alignRight } = this.props;
    const onClick = iLike ? this.onRemoveReaction : this.onAddReaction;

    return (
      <HeartButton alignRight={!!alignRight} className="heart-button" onClick={onClick}>
        <HeartSvg icon="Heart" liked={iLike}/>
      </HeartButton>
    )
  }
  renderString() {
    const { iLike } = this.state;
    const { reactions } = this.props;

    return (
      <LikeString 
        show={reactions && !!reactions.size}
        liked={iLike}>
        {reactions && reactions.size}
      </LikeString>
    )
  }
  
  render() {
    const { alignRight } = this.props;

    return (
      <Container onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        {alignRight ? this.renderString() : this.renderButton()}
        {alignRight ? this.renderButton() : this.renderString()}
      </Container>
    );
  }
}

export default connect(state => ({
  myId: state.getIn(['me', 'id']),
}), {
  successGradient: mainActions.successGradient,
  tooltip: mainActions.tooltip,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction,
})(Reactions);
