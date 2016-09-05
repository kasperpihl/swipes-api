'use strict'
/*
  Delegate Methods
  - onCardClick
  - onCardShare
  - onCardAction
  - onCardSubscribe
  - onCardUnsubscribe

 */
import './swipes-card.scss';

import React, { Component, PropTypes } from 'react';
import { bindAll } from '../../classes/utils';
import SwipesCardItem from './SwipesCardItem';

export default class SwipesCard extends Component {
  constructor(props){
    super(props);
    bindAll(this, ['callDelegate'])
  }
  componentDidMount(){
    this.callDelegate('onCardLoad', 'hello', 'world');
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  
  
  renderLoading(){

  }
  render () {
    const { data } = this.props;

    return (
      <div className="swipes-card">
        <SwipesCardItem callDelegate={this.callDelegate} data={data} />
      </div>
    )
  }
}

SwipesCard.propTypes = {
  data: PropTypes.object,
  delegate: PropTypes.object
}
