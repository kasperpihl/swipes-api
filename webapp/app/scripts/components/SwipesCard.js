'use strict'

import React, { Component, PropTypes } from 'react';
import SwipesDot from 'swipes-dot';

export default class SwipesCard extends Component {
  renderDot(actions){
    if( actions && actions.length ) {
      return (
        <div className="dot-wrapper">
          <SwipesDot
              hoverParentId='card-container'
              elements={actions} />
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
      <div className="service-icon-wrapper">
        <img src={iconUrl} alt="" />
      </div>
    </div>
  }
}


SwipesCard.propTypes = {
  title: PropTypes.string.isRequired,
  iconUrl: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
    icon: PropTypes.string,
    iconUrl: PropTypes.string,
    bgColor: PropTypes.string
  }))
}