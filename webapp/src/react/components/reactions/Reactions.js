import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
import { setupDelegate } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
import './styles/reactions.scss';

class Reactions extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    setupDelegate(this);
    this.callDelegate.bindAll('onAddReaction', 'onRemoveReaction');
  }
  componentWillMount() {
    this.updateILike(this.props.reactions);
  }
  componentWillReceiveProps(nextProps) {
    this.updateILike(nextProps.reactions);
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
  renderLoader() {


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
      <div className="reactions__label">
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

export default Reactions

// const { string } = PropTypes;

Reactions.propTypes = {};
