import React, { Component, PropTypes } from 'react';
import SwipesCardItem from './SwipesCardItem';
import { bindAll } from '../../classes/utils';

import './swipes-card.scss';

class SwipesCardList extends Component {
  constructor(props) {
    super(props)
    bindAll(this, ['callDelegate']);
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(null, [this].concat(Array.prototype.slice.call(arguments, 1)));
    }
  }
  componentDidMount() {
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
        <SwipesCardItem callDelegate={this.callDelegate} data={listItem} />
      </div>
    )
  }
  render() {
    const { title, titleLeftImage, titleRightImage, data } = this.props;

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
  titleRightImage: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.object),
  delegate: PropTypes.object
}
