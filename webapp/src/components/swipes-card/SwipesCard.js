'use strict'

import './swipes-card.scss';

import React, { Component, PropTypes } from 'react';
import { randomString, bindAll } from '../../classes/utils';
import SwipesCardItem from './SwipesCardItem';

export default class SwipesCard extends Component {
  constructor(props){
    super(props);
    this.state = { data: props.data };
    bindAll(this, ['onDragStart', 'clickedCard', 'updateData'])
    this.id = randomString(5);
  }
  updateData(data){
    this.setState({ data });
  }
  componentDidMount(){
    const { dataId, shortUrlProvider } = this.props;
    if(dataId && shortUrlProvider){
      shortUrlProvider.subscribe(dataId, this.updateData, this.id);
    }
  }
  componentWillUnmount(){
    const { dataId, shortUrlProvider } = this.props;
    if(dataId && shortUrlProvider){
      shortUrlProvider.unsubscribe(dataId, this.updateData, this.id);
    }
  }
  onDragStart(){
    const { onDragStart, dataId } = this.props;
    if(onDragStart){
      onDragStart(dataId)
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

    return (
      <div id={"card-container"+this.id} onClick={this.clickedCard} className="swipes-card">
        <SwipesCardItem data={data} hoverParentId={'card-container' + this.id} onDragStart={this.onDragStart} />
      </div>
    )
  }
}

SwipesCard.propTypes = {
  shortUrlProvider: PropTypes.shape({
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired
  }),
  onClick: PropTypes.func,
  dataId: PropTypes.string,
  onDragStart: PropTypes.func,
  data: PropTypes.object
}
