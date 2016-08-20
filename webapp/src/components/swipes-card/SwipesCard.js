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
  renderImage(image) {
    let url = image;
    let width, height;
    if(typeof image === 'object'){
      width = image.width;
      height = image.height;
      url = image.url;
    }

    if(url) {
      return (
        <div className="swipes-card__preview">
          <div className="swipes-card__preview--img">
            <img src={url} height={height} width={width} alt=""/>
          </div>
        </div>
      )
    }
  }
  renderLoading(){

  }
  clickedCard(e){
    const { onClick, dataId, data } = this.props;
    if(!window.getSelection().toString().length && onClick){
        onClick(dataId, data);
    }
  }
  render () {
    const data = this.state.data || { title: "Loading..." }
    const {
      title,
      headerImage,
      subtitle,
      actions,
      description,
      image
    } = data;

    return (
      <div id={"card-container"+this.id} onClick={this.clickedCard} className="swipes-card">
        {this.renderHeader(actions, title, subtitle, headerImage)}
        {this.renderDescription(description)}
        {this.renderImage(image)}
      </div>
    )
  }
}

const stringOrNum = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
])
const imageProps = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    url: PropTypes.string,
    height: stringOrNum,
    width: stringOrNum
  })
]);

SwipesCard.propTypes = {
  dataDelegate: PropTypes.func,
  onClick: PropTypes.func,
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
      bgColor: PropTypes.string
    }))
  }),
  onDragStart: PropTypes.func
}
