import React, { Component, PropTypes } from 'react';
import SwipesCardItem from './SwipesCardItem';
import { bindAll } from '../../classes/utils';

import './swipes-card.scss';
import EyeIcon from './images/swipes-ui-icon-see.svg';

class SwipesCardList extends Component {
  constructor(props) {
    super(props)
    this.state = { selectedTab: 0 };
    bindAll(this, ['callDelegate']);
  }
  callDelegate(name){
    const { delegate } = this.props;
    if(delegate && typeof delegate[name] === "function"){
      return delegate[name].apply(delegate, [this].concat(Array.prototype.slice.call(arguments, 1)));
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
      <div className={"sw-card-list__header sw-card-list__header--title" + hasLeftImage}>
        {this.renderHeaderImage(titleLeftImage, null)}
        <div className="sw-card-list__header__title">{title}</div>
        {this.renderHeaderImage(null,titleRightImage)}
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
      <div className="sw-card-list__header sw-card-list__header--tabs">
        {tabs}
        {this.renderSlider(data.length, selectedTab)}
      </div>
    )
  }
  renderTabItem(title, i, selected) {
    let tabClass = 'sw-card-list__header__tab';

    if (selected) {
      tabClass += ' sw-card-list__header__tab--active'
    }

    return (
      <div className={tabClass} key={'tab-' + i} onClick={this.tabClick.bind(this, i)}>{title}</div>
    )
  }
  renderSlider(number, pos) {
    const styles = {
      width: 100 / number + '%',
      left: pos * (100 / number) + '%'
    }

    return (
      <tabSlider style={styles}></tabSlider>
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
  // Removed templorary until we figure out how we want to build "view more"
  // renderAction(label) {
  //   if (label && label.length > 0) {
  //
  //     return (
  //       <div className="sw-card-list__action">
  //         <div className="sw-card-list__action__label">{label}</div>
  //         <div className="sw-card-list__action__icon">
  //           <EyeIcon />
  //         </div>
  //       </div>
  //     )
  //   }
  // }
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

const { string, arrayOf, oneOfType, shape } = PropTypes;
const dataType = {
  title: string.isRequired,
  items: arrayOf(SwipesCardItem.propTypes.data).isRequired,
  titleLeftImage: string,
  titleRightImage: string
}

SwipesCardList.propTypes = {
  data: oneOfType([
    shape(dataType),
    arrayOf(shape(dataType))
  ]).isRequired,
  // delegate: PropTypes.object.isRequired
}
