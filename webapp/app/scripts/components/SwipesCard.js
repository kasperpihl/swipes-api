'use strict'

import React, { Component, PropTypes } from 'react';
import SwipesDot from 'swipes-dot';

export default class SwipesCard extends Component {
  constructor(props){
    super(props);
    this.onDragStart = props.onDragStart || function(){};
  }
  renderDot(actions){
    if( actions && actions.length ) {
      return (
        <div className="dot-wrapper">
          <SwipesDot
              onDragStart={this.onDragStart}
              hoverParentId='card-container'
              elements={[actions]} />
        </div>
      )
    }
  }
  renderIcon(iconUrl){
    if(iconUrl){
      return (
        <div className="service-icon-wrapper">
          <img src={iconUrl} alt="" />
        </div>
      )
    }
    
  }
  render () {
    const {
      title,
      iconUrl,
      actions
    } = this.props;

    return <div id="card-container" className="shared-card">
      {this.renderDot(actions)}
      <div className="title">{title}</div>
      {this.renderIcon(iconUrl)}
    </div>
  }
}


SwipesCard.propTypes = {
  title: PropTypes.string.isRequired,
  iconUrl: PropTypes.string,
  onDragStart: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
    icon: PropTypes.string,
    iconUrl: PropTypes.string,
    bgColor: PropTypes.string
  }))
}