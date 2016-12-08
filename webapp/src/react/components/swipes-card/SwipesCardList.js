import React, { Component, PropTypes } from 'react';
import SwipesCardItem from './SwipesCardItem';
import { bindAll, setupDelegate } from 'classes/utils';

import './swipes-card.scss';

class SwipesCardList extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedTab: 0 };
    bindAll(this, ['callDelegate']);
    this.callDelegate = setupDelegate(props.delegate, this);
  }
  componentDidMount() {
  }
  tabClick(i) {
    this.setState({ selectedTab: i });
    this.callDelegate('onCardChangedTab', i);
  }
  renderTabsHeader(data, selectedTab) {
    const tabs = data.map((tab, i) =>
      <TabItem title={tab.title} i={i} selected={(i === selectedTab)} callback={this.tabClick} />,
    );

    return (
      <div className="sw-card-list__header sw-card-list__header--tabs">
        {tabs}
        {this.renderSlider(data.length, selectedTab)}
      </div>
    );
  }
  renderSlider(number, pos) {
    const styles = {
      width: `${100 / number}%`,
      left: `${pos * (100 / number)}%`,
    };

    return (
      <tabSlider style={styles} />
    );
  }
  renderList(data, selectedTab) {
    let items = data.items;
    if (Array.isArray(data)) {
      items = data[selectedTab].items;
    }

    const list = items.map((listItem, i) => this.renderListItem(listItem, i));

    return (
      <div className="sw-card-list__list">
        {list}
      </div>
    );
  }
  renderListItem(listItem, i) {
    let paddingClass = '';
    if (listItem.description) {
      paddingClass = 'sw-card-list__list--padding';
    }
    return (
      <div
        id={`card-container${this.id}${i}`}
        className={`sw-card-list__list--item ${paddingClass}`}
        key={`swipes-card-list-item-${i}`}
        onClick={this.clickedCard}
      >
        <SwipesCardItem callDelegate={this.callDelegate} data={listItem} />
      </div>
    );
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
  renderHeaderImage(titleLeftImage, titleRightImage) {
    if (titleLeftImage) {
      return (
        <div className="sw-card-list__header__image sw-card-list__header__image--left">
          <img src={titleLeftImage} alt="" />
        </div>
      );
    }

    if (titleRightImage) {
      return (
        <div className="sw-card-list__header__image sw-card-list__header__image--right">
          <img src={titleRightImage} alt="" />
        </div>
      );
    }

    return undefined;
  }
  renderHeader(data, selectedTab) {
    if (Array.isArray(data)) {
      return this.renderTabsHeader(data, selectedTab);
    }
    const { titleLeftImage, titleRightImage, title } = data;

    let hasLeftImage = '';

    if (titleLeftImage) {
      hasLeftImage = ' sw-card-list__header--left-image';
    }

    return (
      <div className={`sw-card-list__header sw-card-list__header--title${hasLeftImage}`}>
        {this.renderHeaderImage(titleLeftImage, null)}
        <div className="sw-card-list__header__title">{title}</div>
        {this.renderHeaderImage(null, titleRightImage)}
      </div>
    );
  }
  render() {
    const { data } = this.props;
    const selectedTab = this.state.selectedTab;

    return (
      <div className="sw-card-list">
        {this.renderHeader(data, selectedTab)}
        {this.renderList(data, selectedTab)}
      </div>
    );
  }
}

const TabItem = (props) => {
  let tabClass = 'sw-card-list__header__tab';

  if (props.selected) {
    tabClass += ' sw-card-list__header__tab--active';
  }

  return (
    <div className={tabClass} key={`tab-${props.i}`} onClick={props.callback(this, props.i)}>{props.title}</div>
  );
};

export default SwipesCardList;

const { string, arrayOf, oneOfType, shape, bool, number, func } = PropTypes;
const dataType = {
  title: string.isRequired,
  items: arrayOf(SwipesCardItem.propTypes.data).isRequired,
  titleLeftImage: string,
  titleRightImage: string,
};

SwipesCardList.propTypes = {
  data: oneOfType([
    shape(dataType),
    arrayOf(shape(dataType)),
  ]).isRequired,
  delegate: PropTypes.object,
};


TabItem.propTypes = {
  selected: bool,
  i: number,
  callback: func,
  title: string,
};
