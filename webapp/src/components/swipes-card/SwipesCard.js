'use strict'

import './swipes-card.scss';

import React, { Component, PropTypes } from 'react';
import { bindAll } from '../../classes/utils';
import SwipesCardItem from './SwipesCardItem';

export default class SwipesCard extends Component {
  constructor(props){
    super(props);
    this.state = { data: props.data };
    bindAll(this, ['callDelegate'])
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
    const data = this.state.data || { title: "Loading..." }

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
