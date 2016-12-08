import React, { Component, PropTypes } from 'react';
import { bindAll, setupDelegate } from 'classes/utils';

/*
  Delegate Methods
  - onCardClick
  - onCardShare
  - onCardAction
  - onCardSubscribe
  - onCardUnsubscribe

 */
import './swipes-card.scss';
import SwipesCardItem from './SwipesCardItem';

export default class SwipesCard extends Component {
  constructor(props) {
    super(props);
    bindAll(this, ['callDelegate']);
    this.callDelegate = setupDelegate(props.delegate, this);
  }
  callDelegate(name) {
    const { delegate } = this.props;
    if (delegate && typeof delegate[name] === 'function') {
      return delegate[name](...[this].concat(Array.prototype.slice.call(arguments, 1)));
    }

    return undefined;
  }


  renderLoading() {

  }
  render() {
    const { data } = this.props;

    return (
      <div className="swipes-card">
        <SwipesCardItem callDelegate={this.callDelegate} data={data} />
      </div>
    );
  }
}

const { object } = PropTypes;
SwipesCard.propTypes = {
  data: SwipesCardItem.propTypes.data,
  delegate: object,
};
