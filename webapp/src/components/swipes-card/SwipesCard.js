'use strict'

import './swipes-card.scss';

import React, { Component, PropTypes } from 'react';
import { randomString, bindAll } from '../../classes/utils'
import SwipesDot from '../swipes-dot/SwipesDot';

export default class SwipesCard extends Component {
  constructor(props){
    super(props);
    this.state = { data: props.data };
    bindAll(this, ['onDragStart', 'clickedCard'])
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
    const noSubtitleClass = !subtitle ? "no-subtitle" : '';
    return (
      <div className="swipes-card__header">
        <div className="swipes-card__header__dot">
          {this.renderDot(actions)}
        </div>
        <div className={"swipes-card__header__content " + noSubtitleClass}>
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
    if(!description){
      return;
    }
    return (
      <div className="description-container">
        <div className="swipes-card__description">
          {description}
        </div>
      </div>
    )
  }
  renderPreview(preview) {
    if(!preview){
      return;
    }
  console.log()
    if (preview.type === 'image') {
      return (
        <div className="swipes-card__preview">
          <div className="swipes-card__preview--img">
            <img src={preview.url} height={preview.height} width={preview.width} alt=""/>
          </div>
        </div>
      )
    }

    if (preview.type === 'html') {
      return (
        <div className="swipes-card__preview no-style">
          <div className="swipes-card__preview--iframe">
            <div className="custom-html" dangerouslySetInnerHTML={{__html: preview.html}}></div>
          </div>
        </div>
      )
    }
  }
  renderLoading(){

  }
  clickedCard(e){
    console.log('clicked card here', window.getSelection().toString());
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
      preview
    } = data;

    return (
      <div id={"card-container"+this.id} onClick={this.clickedCard} className="swipes-card">

        {this.renderHeader(actions, title, subtitle, headerImage)}
        {this.renderDescription(description)}

        {this.renderPreview(preview)}
      </div>
    )
  }
}

const stringOrNum = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
])

SwipesCard.propTypes = {
  dataDelegate: PropTypes.func,
  onClick: PropTypes.func,
  dataId: PropTypes.string,
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string,
    headerImage: PropTypes.string,
    preview: PropTypes.shape({
      type: PropTypes.oneOf(['html', 'image']).isRequired,
      url: PropTypes.string,
      html: PropTypes.string,
      width: stringOrNum,
      height: stringOrNum

    }),
    actions: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
      icon: PropTypes.string,
      bgColor: PropTypes.string
    }))
  }),
  onDragStart: PropTypes.func
}
