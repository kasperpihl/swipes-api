'use strict'

import './swipes-card.scss';

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
  renderIcon(headerImage){
    if(headerImage){
      return (
        <div className="service-icon-wrapper">
          <img src={headerImage} alt="" />
        </div>
      )
    }

  }
  render () {
    const {
      title,
      headerImage,
      actions
    } = this.props;

    return <div id="card-container" className="shared-card">
      {this.renderDot(actions)}
      <div className="title">{title}</div>
      {this.renderIcon(headerImage)}
    </div>
  }
}


SwipesCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  headerImage: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.shape({
      url: PropTypes.string
    })
  ]),
  onDragStart: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
    icon: PropTypes.string,
    headerImage: PropTypes.string,
    bgColor: PropTypes.string
  }))
}
