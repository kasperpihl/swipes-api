import React, { PureComponent } from 'react';
import SW from './ProjectOverview.swiss';
import data from './data';
import PStateManager from '../utils/project/PStateManager';
import ProjectItem from 'src/react/views/Project/Item/ProjectItem';

export default class Tester extends PureComponent {
  static sizes() {
    return [654];
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    this.stateManager = new PStateManager(
      data.order,
      data.itemsById,
      this.onStateChange
    );
    this.setState(this.stateManager.getState());
  }
  componentWillUnmount() {
    this.stateManager.destroy();
  }
  onStateChange = state => this.setState(state);
  onSliderChange = e => {
    const depth = parseInt(e.target.value, 10);
    this.stateManager.indentHandler.enforceIndention(depth);
  };
  onAdd = () => {
    this.stateManager.editHandler.add();
  };
  componentDidUpdate() {
    if (typeof this.focusI === 'number') {
      this.focusI = undefined;
      this.selectionStart = undefined;
    }
  }
  renderItems() {
    const {
      visibleOrder,
      itemsById,
      selectedIndex,
      selectionStart,
    } = this.state;
    return visibleOrder.map((item, i) => (
      <ProjectItem
        focus={i === selectedIndex}
        selectionStart={i === selectedIndex && selectionStart}
        item={itemsById.get(item.get('id'))}
        orderItem={item}
        key={item.get('id')}
        stateManager={this.stateManager}
      />
    ));
  }
  render() {
    const { sliderValue } = this.state;
    return (
      <SW.Wrapper>
        <SW.Header>
          <SW.HeaderTitle>Discussions Release</SW.HeaderTitle>
          <input
            type="range"
            onChange={this.onSliderChange}
            min={0}
            max={4}
            value={sliderValue}
          />
        </SW.Header>
        {this.renderItems()}
        <SW.AddButton
          onClick={this.onAdd}
          title="Add item"
          icon="Plus"
          compact
        />
      </SW.Wrapper>
    );
  }
}
