import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate, bindAll, setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AssigneeTooltip from 'components/assigning/AssigneeTooltip';
import Icon from 'Icon';
import './styles/reactions.scss';

class HOCReactions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupLoading(this);
    bindAll(this, ['onEnter', 'onLeave', 'onAddReaction', 'onRemoveReaction']);
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
  onAddReaction() {
    const { postId, commentId, addReaction, commentAddReaction } = this.props;
    const runFunc = commentId ? commentAddReaction : addReaction;

    this.setLoading('reaction');
    runFunc({
      post_id: postId,
      reaction: 'like',
      comment_id: commentId || null,
    }).then((res) => {
      if(res.ok) {
        window.analytics.sendEvent('Reaction added', {
          'Where': commentId ? 'Comment' : 'Post',
        });
      }
      this.clearLoading('reaction')
    });
  }
  onRemoveReaction() {
    const { postId, commentId, removeReaction, commentRemoveReaction } = this.props;
    const runFunc = commentId ? commentRemoveReaction : removeReaction;

    this.setLoading('reaction');
    runFunc({
      post_id: postId,
      comment_id: commentId,
    }).then((res) => {
      if(res.ok) {
        window.analytics.sendEvent('Reaction removed', {
          'Where': commentId ? 'Comment' : 'Post',
        });
      }
      this.clearLoading('reaction')
    });
  }
  onEnter(e) {
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
  onLeave() {
    const { tooltip } = this.props;

    clearTimeout(this.tooltipDelay)
    tooltip(null);
  }
  updateILike(nextReactions) {
    const { reactions } = this.props;
    const myId = msgGen.users.getUser('me').get('id');
    const { iLike } = this.state;

    if (typeof iLike === 'undefined' || reactions !== nextReactions) {
      const newILike = !!nextReactions.find(r => r.get('created_by') === myId);

      if (iLike !== newILike) {
        this.setState({ iLike: newILike });
      }
    }
  }
  renderButton() {
    const { commentId: cId } = this.props;
    const { iLike } = this.state;
    let className = 'reactions__button';
    let iconClass = 'reactions__heart';

    if (this.isLoading('reaction')) {
      className += ' reactions__button--loading';
    }

    if (iLike) {
      iconClass += ' reactions__heart--liked';
    }

    const labelAction = iLike ? 'Unlike' : 'Like';
    const onClick = iLike ? this.onRemoveReaction : this.onAddReaction;

    return (
      <div onClick={onClick} className={className}>
        <Icon icon="Heart" className={iconClass} />
      </div>
    )
  }
  renderLikers() {
    const { reactions, commentId, commentView } = this.props;

    if (!reactions || !reactions.size) {
      return undefined;
    }

    const { iLike } = this.state;
    let likeString = reactions.size;
    let className = 'reactions__label';

    if (iLike) {
      className += ' reactions__label--liked';
    }

    return (
      <div className={className}>
        {likeString}
      </div>
    )
  }
  render() {
    const { commentId } = this.props;
    let className = 'reactions';

    if (commentId) {
      className += ' reactions--comment'
    }

    return (
      <div className={className} onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        {this.renderButton()}
        {this.renderLikers()}
      </div>
    );
  }
}

// const {string} = PropTypes;

HOCReactions.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps, {
  tooltip: a.main.tooltip,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction,
})(HOCReactions);
