import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupDelegate, bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AssigneeTooltip from 'components/assigning/AssigneeTooltip';
import Icon from 'Icon';
import './styles/reactions.scss';

class HOCReactions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
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

    this.setState({ iLike: true });
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
    });
  }
  onRemoveReaction() {
    const { postId, commentId, removeReaction, commentRemoveReaction } = this.props;
    const runFunc = commentId ? commentRemoveReaction : removeReaction;

    this.setState({ iLike: false });
    runFunc({
      post_id: postId,
      comment_id: commentId,
    }).then((res) => {
      if(res.ok) {
        window.analytics.sendEvent('Reaction removed', {
          'Where': commentId ? 'Comment' : 'Post',
        });
      }
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

    let iconClass = 'reactions__heart';
    if (iLike) {
      iconClass += ' reactions__heart--liked';
    }

    const onClick = iLike ? this.onRemoveReaction : this.onAddReaction;

    return (
      <div onClick={onClick} className="reactions__button">
        <Icon icon="Heart" className={iconClass} />
      </div>
    )
  }
  renderLikers() {
    const { reactions } = this.props;

    if (!reactions || !reactions.size) {
      return undefined;
    }

    const { iLike } = this.state;
    let className = 'reactions__label';

    if (iLike) {
      className += ' reactions__label--liked';
    }

    return (
      <div className={className}>{reactions.size}</div>
    )
  }
  render() {
    return (
      <div className="reactions" onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        {this.renderButton()}
        {this.renderLikers()}
      </div>
    );
  }
}

// const {string} = PropTypes;

HOCReactions.propTypes = {};

const mapStateToProps = state => ({
  myId: state.getIn(['me', 'id']),
});

export default connect(mapStateToProps, {
  tooltip: a.main.tooltip,
  addReaction: ca.posts.addReaction,
  commentAddReaction: ca.posts.commentAddReaction,
  commentRemoveReaction: ca.posts.commentRemoveReaction,
  removeReaction: ca.posts.removeReaction,
})(HOCReactions);
