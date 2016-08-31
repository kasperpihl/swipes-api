import React, { Component, PropTypes } from 'react';
import SwipesCardItem from './SwipesCardItem';
import { bindAll } from '../../classes/utils';

import './swipes-card.scss';

class SwipesCardList extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedTab: 0 };
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
  renderHeader(data, selectedTab) {
    if(Array.isArray(data)){
      return this.renderTabsHeader(data, selectedTab);
    }

    const { titleLeftImage, titleRightImage, title } = data;
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
  renderTabsHeader(data, selectedTab) {
    const tabs = data.map( (tab, i) => this.renderTabItem(tab.title, i, (i === selectedTab)))

    return (
      <div className="sw-tabs">
        <div className="sw-tabs__selectors">
          {tabs}
        </div>
      </div>
    )
  }
  renderTabItem(title, i, selected) {
    let tabClass = 'sw-tabs__selectors__tab';

    if (selected) {
      tabClass += ' sw-tabs__selectors__tab--active'
    }

    return (
      <div className={tabClass} key={'tab-' + i} onClick={this.tabClick.bind(this, i)}>{title}</div>
    )
  }
  renderList(data, selectedTab) {
    let items = data.items;
    if(Array.isArray(data)){
      items = data[selectedTab].items;
    }

    const list = items.map( (listItem, i) => this.renderListItem(listItem, i) )

    return (
      <div className="sw-card-list__list">
        {list}
      </div>
    )
  }
  renderListItem(listItem, i) {
    console.log(listItem)
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
  tabClick(i) {
    console.log(i)
    this.setState({selectedTab: i});
    this.callDelegate('onCardChangedTab', i);
  }
  render() {
    const { data } = this.props;
    const selectedTab = this.state.selectedTab;

    return (
      <div className="sw-card-list">
        {this.renderHeader(data, selectedTab)}
        {this.renderList(data, selectedTab)}
      </div>
    )
  }
}

export default SwipesCardList

const dataType = {
  title: PropTypes.string,
  items: PropTypes.array,
  titleLeftImage: PropTypes.string,
  titleRightImage: PropTypes.string,
}

SwipesCardList.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.shape(dataType),
    PropTypes.array
  ]),
  delegate: PropTypes.object.isRequired
}
