'use strict'

import './swipes-card.scss';

import React, { Component, PropTypes } from 'react';
import { randomString, bindAll } from '../../classes/utils'
import SwipesDot from '../swipes-dot/SwipesDot';

export default class SwipesCard extends Component {
  constructor(props){
    super(props);
    this.state = { data: props.data };
    bindAll(this, ['onDragStart'])
    this.id = randomString(5);
    // Setup delegate structure to provide data
    if(typeof props.dataDelegate === 'function'){
      this.updateData = (data) => {
        this.setState({ data });
      }
      props.dataDelegate(props.dataId, this.updateData);
    }
  }
  componentWillUnmount(){
    if(this.props.dataDelegate){
      this.props.dataDelegate(this.props.dataId, this.updateData, true);
    }
  }
  onDragStart(){
    const { onDragStart, dataId } = this.props;
    if(onDragStart){
      onDragStart(dataId)
    }
  }
  renderDot(actions){
    // add back to swipesdot elements={[actions]}
    return (
      <div className="dot-wrapper">
        <SwipesDot
          onDragStart={this.onDragStart}
          hoverParentId={'card-container' + this.id}
        />
      </div>
    )
  }
  renderHeaderImage(headerImage){
    if(headerImage){
      return (
        <img src={headerImage} alt="" />
      )
    }
  }
  renderHeader(actions, title, subtitle, headerImage) {
    return (
      <div className="swipes-card__header">
        <div className="swipes-card__header__dot">
          {this.renderDot(actions)}
        </div>
        <div className="swipes-card__header__content">
          <div className="swipes-card__header__content--title">{title}</div>
          <div className="swipes-card__header__content--subtitle">{subtitle}</div>
        </div>
        <div className="swipes-card__header__image">
          {this.renderHeaderImage(headerImage)}
        </div>
      </div>
    )
  }
  renderDescription(description) {
    return (
      <div className="swipes-card__description">
        {description}
      </div>
    )
  }
  renderImage(img) {
    if(img) {
      return (
        <div className="swipes-card__preview">
          <div className="swipes-card__preview--img">
            <img src={img} alt=""/>
          </div>
        </div>
      )
    }
  }
  renderLoading(){

  }
  render () {
    const data = this.state.data || { title: "Loading..." }
    const {
      title,
      headerImage,
      subtitle,
      actions,
      description,
      img
    } = data;

    return (
      <div id={"card-container"+this.id} className="swipes-card">
        {this.renderHeader(actions, title, subtitle, headerImage)}
        {this.renderDescription(description)}
        {this.renderImage(img)}
      </div>
    )
  }
}

const imageProps = PropTypes.oneOf([
  PropTypes.string,
  PropTypes.shape({
    url: PropTypes.string,
    height: PropTypes.string,
    width: PropTypes.string
  })
]);

SwipesCard.propTypes = {
  dataDelegate: PropTypes.func,
  dataId: PropTypes.string,
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    headerImage: imageProps,
    image: imageProps,
    actions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
      icon: PropTypes.string,
      headerImage: PropTypes.string,
      bgColor: PropTypes.string
    }))
  }),
  onDragStart: PropTypes.func
}
