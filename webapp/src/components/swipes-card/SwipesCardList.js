import React, { Component, PropTypes } from 'react';
import SwipesCardItem from './SwipesCardItem';
import { randomString, bindAll } from '../../classes/utils';

import './swipes-card.scss';

class SwipesCardList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.state = { data: props.data };
    bindAll(this, ['onDragStart']);
    this.id = randomString(5);
    // Setup delegate structure to provide data
    if(typeof props.dataDelegate === 'function'){
      this.updateData = (data) => {
        this.setState({ data });
      }
      props.dataDelegate(props.dataId, this.updateData);
    }
  }
  componentDidMount() {
  }
  onDragStart(){
    const { onDragStart, dataId } = this.props;

    if(onDragStart){
      onDragStart(dataId)
    }
  }
  clickedCard(e){
    console.log('clicked card here', window.getSelection().toString());
    const { onClick, dataId, data } = this.props;
    if(!window.getSelection().toString().length && onClick){
        onClick(dataId, data);
    }
  }
  renderHeaderImage(titleLeftImage, titleRightImage) {

    if (titleLeftImage) {
      return (
        <div className="sw-card-list__header__image sw-card-list__header__image--left">
          <img src={titleLeftImage} alt=""/>
        </div>
      )
    }

    if (titleRightImage) {
      return (
        <div className="sw-card-list__header__image sw-card-list__header__image--right">
          <img src={titleRightImage} alt=""/>
        </div>
      )
    }
  }
  renderHeader(title, titleLeftImage, titleRightImage) {
    let hasLeftImage = '';

    if (titleLeftImage) {
      hasLeftImage = ' sw-card-list__header--left-image'
    }
    return (
      <div className={"sw-card-list__header" + hasLeftImage}>
        {this.renderHeaderImage(titleLeftImage)}
        <div className="sw-card-list__header--title">{title}</div>
        {this.renderHeaderImage(titleRightImage)}
      </div>
    )
  }
  renderListItem(listItem, i) {
    let paddingClass = '';
    if (listItem.description) {
      paddingClass = 'sw-card-list__list--padding'
    }
    return (
      <div
        id={'card-container' + this.id + i}
        className={"sw-card-list__list--item " + paddingClass}
        key={'swipes-card-list-item-' + i}
        onClick={this.clickedCard}>
        <SwipesCardItem data={listItem} hoverParentId={'card-container' + this.id + i} onDragStart={this.onDragStart} />
      </div>
    )
  }
  render() {
    const { title, titleLeftImage, titleRightImage } = this.props;
    const data = this.state.data || [{ title: "Loading..." }]

    const list = data.map( (listItem, i) => this.renderListItem(listItem, i) )

    return (
      <div className="sw-card-list">
        {this.renderHeader(title, titleLeftImage, titleRightImage)}
        <div className="sw-card-list__list">
          {list}
        </div>
      </div>
    )
  }
}
export default SwipesCardList

SwipesCardList.propTypes = {
  title: PropTypes.string.isRequired,
  titleLeftImage: PropTypes.string,
  dataDelegate: PropTypes.func,
  onClick: PropTypes.func,
  dataId: PropTypes.string,
  onDragStart: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object)
}
