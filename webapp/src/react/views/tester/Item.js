import React, { PureComponent } from 'react';
import SW from './Item.swiss';

export default class Item extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: props.item.get('title'),
    }
  }
  onChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  }
  render() {
    return (
      <SW.Wrapper>
        <SW.Input
          value={this.state.title}
          onChange={this.onChange}
        />          
      </SW.Wrapper>
    );
  }
}
