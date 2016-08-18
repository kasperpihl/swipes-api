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

    // add back to swipesdot elements={[actions]}
    return (
      <div className="dot-wrapper">
        <SwipesDot
            onDragStart={this.onDragStart}
            hoverParentId='card-container'
            />
      </div>
    )
  }
  renderHeaderImage(headerImage){
    if(headerImage){
      return (
        <div className="service-icon-wrapper">
          <img src={headerImage} alt="" />
        </div>
      )
    }
  }
  renderHeader(actions, title, subtitle, headerImage) {

    return (
      <div className="header">
        <div className="header__dot">
          {this.renderDot(actions)}
        </div>
        <div className="header__content">
          <div className="header__content--title">{title}</div>
          <div className="header__content--subtitle">{subtitle}</div>
        </div>
        <div className="header__image">
          {this.renderHeaderImage(headerImage)}
        </div>
      </div>
    )
  }
  render () {
    const {
      title,
      headerImage,
      subtitle,
      actions
    } = this.props;

    return (
      <div id="card-container" className="swipes-card">
        {this.renderHeader(actions, title, subtitle, headerImage)}
      </div>
    )
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
