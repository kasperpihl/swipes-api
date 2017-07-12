import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
import { setupDelegate, bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AssigneeTooltip from 'components/assigning/AssigneeTooltip';
import './styles/reactions.scss';

class HOCReactions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this);
    this.callDelegate.bindAll('onAddReaction', 'onRemoveReaction');
    bindAll(this, ['onEnter', 'onLeave']);
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
  onEnter(e) {
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
    const { myId, reactions } = this.props;
    const { iLike } = this.state;

    if (typeof iLike === 'undefined' || reactions !== nextReactions) {
      const newILike = !!nextReactions.find(r => r.get('created_by') === myId);

      if (iLike !== newILike) {
        this.setState({ iLike: newILike });
      }
    }
  }
  renderButton() {
    const { isLoading } = this.props;
    const { iLike } = this.state;
    let className = 'reactions__button';

    if (isLoading) {
      className += ' reactions__button--loading'
    }

    const labelAction = iLike ? 'Unlike' : 'Like';
    const onClick = iLike ? this.onRemoveReaction : this.onAddReaction;

    return (
      <div onClick={onClick} className={className}>
        {labelAction}
      </div>
    )
  }
  renderLikers() {
    const { reactions } = this.props;

    if (!reactions || !reactions.size) {
      return undefined;
    }

    const userIds = reactions.map(r => r.get('created_by'));
    const nameString = msgGen.users.getNames(userIds, {
      number: 2,
    });

    return (
      <div className="reactions__label" onMouseEnter={this.onEnter} onMouseLeave={this.onLeave}>
        {nameString} like this.
      </div>
    )
  }
  render() {
    return (
      <div className="reactions">
        {this.renderButton()}
        {this.renderLikers()}
      </div>
    );
  }
}

// const { string } = PropTypes;

HOCReactions.propTypes = {};

function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps, {
  tooltip: a.main.tooltip,
})(HOCReactions);