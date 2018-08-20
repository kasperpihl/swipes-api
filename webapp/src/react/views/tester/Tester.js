import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import SW from './Tester.swiss';
import Item from './Item';

export default class Tester extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      items: fromJS([
        {
          id: 'AFIAS',
          title: 'Hello',
          type: 'task',
        },
      ])
    }
  }
  renderItems() {
    const { items } = this.state;
    return items.map((item, i) => (
      <Item item={item} key={item.get('id')} />
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
