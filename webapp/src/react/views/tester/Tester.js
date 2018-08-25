import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import randomString from 'swipes-core-js/utils/randomString';
import SW from './Tester.swiss';

import Item from './Item';

export default class Tester extends PureComponent {
  static sizes() {
    return [654];
  }
  constructor(props) {
    super(props);
    this.state = {
      items: fromJS([
        {
          id: 'AFIAS',
          title: 'Hello',
          type: 'task',
          indent: 0,
          children: [],
        },
      ])
    }
  }
  onTab = (id, e) => {
    const { items } = this.state;
    const index = items.findIndex(item => item.get('id') === id);
    let maxInd = 0;
    if(index > 0) {
      maxInd = items.getIn([index - 1, 'indent']) + 1;
    }
    const ind = items.get(index).get('indent');
    const modifier = e.shiftKey ? -1 : 1;
    const newInd = e.shiftKey ? Math.max(0, ind + modifier) : Math.min(maxInd, ind + modifier);
    if(newInd === ind) {
      return;
    }
    let foundNextSiblingOrLess = false;
    this.setState({
      items: items.map((item, i) => {
        if(foundNextSiblingOrLess || i < index) return item;
        if(i === index) {
          return item.set('indent', newInd);
        }
        if(item.get('indent') <= ind){
          foundNextSiblingOrLess = true;
          return item;
        }
        return item.set('indent', item.get('indent') + modifier);
      })
    })
  }
  onChange = (id, title) => {
    let { items } = this.state;
    const i = items.findIndex(item => item.get('id') === id);
    items = items.setIn([i, 'title'], title);
    this.setState({ items });
  }
  onUpArrow = (id, selectionStart) => {
    const { items } = this.state;
    const i = items.findIndex(item => item.get('id') === id);
    if(i > 0) {
      this.focusI = i - 1;
      this.selectionStart = selectionStart;
      this.forceUpdate();
    }
  }
  onDownArrow = (id, selectionStart) => {
    const { items } = this.state;    
    const i = items.findIndex(item => item.get('id') === id);
    if(i < items.size - 1) {
      this.focusI = i + 1;
      this.selectionStart = selectionStart;
      this.forceUpdate();
    }
  }
  onDelete = (id) => {
    let { items } = this.state;

    const i = items.findIndex(item => item.get('id') === id);
    const currentTitle = items.getIn([i, 'title']);
    items = items.delete(i);
    this.focusI = Math.max(i - 1, 0);
    if(currentTitle && i > 0) {
      const prevTitle = items.getIn([i - 1, 'title']);
      this.selectionStart = prevTitle.length;
      items = items.setIn([i - 1, 'title'], prevTitle + currentTitle);
    }
    this.setState({ items });
  }
  onEnter = (id, selectionStart) => {
    let { items } = this.state;
    const i = items.findIndex(item => item.get('id') === id);
    const currentItem = items.get(i);
    let currTitle = currentItem.get('title');
    let nextTitle = '';
    if(selectionStart < currentItem.get('title').length) {
      nextTitle = currTitle.slice(selectionStart);
      currTitle = currTitle.slice(0, selectionStart);
      console.log(currTitle);
      items = items.setIn([i, 'title'], currTitle);
    }
    items = items.insert(i + 1, fromJS({
      id: randomString(5),
      title: nextTitle,
      type: 'task',
      indent: currentItem.get('indent'),
    }))
    this.focusI = i + 1;
    this.selectionStart = 0;
    if(selectionStart === 0 && !currTitle && nextTitle) {
      this.focusI = i;
    }
    this.setState({
      items,
    });
  }
  componentDidUpdate() {
    if(typeof this.focusI === 'number') {
      this.focusI = undefined;
      this.selectionStart = undefined;
    }
  }
  renderItems() {
    const { items } = this.state;
    return items.map((item, i) => (
      <Item
        focus={i === this.focusI}
        selectionStart={i === this.focusI && this.selectionStart}
        item={item}
        key={item.get('id')}
        onUpArrow={this.onUpArrow}
        onDownArrow={this.onDownArrow}
        onEnter={this.onEnter}
        onDelete={this.onDelete}
        onTab={this.onTab}
        onChange={this.onChange}
      />
    ))
  }
  render() {
    return (
      <SW.Wrapper>
        {this.renderItems()}
      </SW.Wrapper>
    )
  }
}
