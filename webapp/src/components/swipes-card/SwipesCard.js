'use strict'

import './swipes-card.scss';

import React, { Component, PropTypes } from 'react';
import { randomString, bindAll } from '../../classes/utils';
import SwipesCardItem from './SwipesCardItem';

export default class SwipesCard extends Component {
  constructor(props){
    super(props);
    this.state = { data: props.data };
    bindAll(this, ['onDragStart', 'onClick', 'onAction', 'updateData', 'callDelegate'])
    this.id = randomString(5);
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  getShareUrl(){
    const { shareUrl } = this.props;
    let url = shareUrl;
    if(typeof shareUrl === 'object'){
      url = shareUrl.url;
    }
    return url;
  }
  getProvider(){
    const { shareUrl } = this.props;
    let provider = window.swipesUrlProvider;
    if(typeof shareUrl === 'object'){
      provider = shareUrl.provider || provider;
    }
    return provider;
  }
  updateData(data){
    this.setState({ data });
  }
  componentDidMount(){
    const provider = this.getProvider();
    if(provider){
      provider.subscribe(this.getShareUrl(), this.updateData, this.id);
    }
  }
  componentWillUnmount(){
    const provider = this.getProvider();
    if(provider){
      provider.unsubscribe(this.getShareUrl(), this.updateData, this.id);
    }
  }
  onDragStart(){
    const shareUrl = this.getShareUrl();
    const { data } = this.props;
    this.callDelegate('onCardShare', data, shareUrl, true);
  }
  renderLoading(){

  }
  onClick(e){
    const { data } = this.props;
    const shareUrl = this.getShareUrl();
    if(!window.getSelection().toString().length && onClick){
      this.callDelegate('onCardClick', data, shareUrl);
    }
  }
  onAction(action){
    const shareUrl = this.getShareUrl();
    const { onShare, onAction, data } = this.props;
    if(action.label === 'Share'){
      this.callDelegate('onCardShare', data, shareUrl);
    }
    else {
      this.callDelegate('onCardAction', data, shareUrl, action);
    }
  }
  render () {
    const data = this.state.data || { title: "Loading..." }

    return (
      <div id={"card-container"+this.id} onClick={this.clickedCard} className="swipes-card">
        <SwipesCardItem data={data} hoverParentId={'card-container' + this.id} onDragStart={this.onDragStart} />
      </div>
    )
  }
}

SwipesCard.propTypes = {
  data: PropTypes.object,
  shareUrl: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      provider: PropTypes.shape({
        subscribe: PropTypes.func.isRequired,
        unsubscribe: PropTypes.func.isRequired
      })
    })
  ]),
  delegate: PropTypes.object
}
