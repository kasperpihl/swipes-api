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
  renderHeader(title) {

    return (
      <div className="sw-card-list__header">
        <div className="sw-card-list__header--title">{title}</div>
      </div>
    )
  }
  renderListItem(listItem, i) {
    let paddingClass = '';
    if (listItem.description) {
      paddingClass = 'sw-card-list__list--padding'
    }
    return (
      <div id={'card-container' + this.id + i} className={"sw-card-list__list--item " + paddingClass} key={'item-' + i}>
        <SwipesCardItem data={listItem} hoverParentId={'card-container' + this.id + i} onDragStart={this.onDragStart} />
      </div>
    )
  }
  render() {
    const { title } = this.props;
    const data = this.state.data || [{ title: "Loading..." }]

    const list = data.map( (listItem, i) => this.renderListItem(listItem, i) )

    return (
      <div className="sw-card-list">
        {this.renderHeader(title)}
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
  dataId: PropTypes.string,
  onDragStart: PropTypes.func,
  data: PropTypes.arrayOf(PropTypes.object)
}
