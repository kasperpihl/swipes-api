import React, { PureComponent } from "react";
import { fromJS } from "immutable";
import randomString from "swipes-core-js/utils/randomString";
import SW from "./Tester.swiss";
import indentWithChildren from "./indentWithChildren";
import updateHasChildrenForItem from "./updateHasChildrenForItem";
import Slider from "rc-slider/lib/Slider";
import "rc-slider/assets/index.css";
import data from "./data";
import Item from "./Item";

export default class Tester extends PureComponent {
  static sizes() {
    return [654];
  }
  constructor(props) {
    super(props);
    this.state = {
      sliderValue: 0,
      ...data
    };
  }
  onTab = (id, e) => {
    const { order } = this.state;
    const modifier = e.shiftKey ? -1 : 1;

    let newOrder = indentWithChildren(order, id, modifier);
    newOrder = updateHasChildrenForItem(newOrder, id);

    if (newOrder !== order) {
      this.setState({
        order: newOrder
      });
    }
  };
  onChangeTitle = (id, title) => {
    let { itemsById } = this.state;
    itemsById = itemsById.setIn([id, "title"], title);
    this.setState({ itemsById });
  };
  onUpArrow = (id, selectionStart) => {
    const { order } = this.state;
    const i = order.findIndex(item => item.get("id") === id);
    if (i > 0) {
      this.focusI = i - 1;
      this.selectionStart = selectionStart;
      this.forceUpdate();
    }
  };
  onDownArrow = (id, selectionStart) => {
    const { order } = this.state;
    const i = order.findIndex(item => item.get("id") === id);
    if (i < order.size - 1) {
      this.focusI = i + 1;
      this.selectionStart = selectionStart;
      this.forceUpdate();
    }
  };
  onDelete = id => {
    let { itemsById, order } = this.state;

    const i = order.findIndex(item => item.get("id") === id);
    const currentTitle = itemsById.getIn([id, "title"]);
    if (i > 0) {
      order = order.delete(i);
      itemsById = itemsById.delete(id);
      this.focusI = Math.max(i - 1, 0);
      const prevId = order.getIn([i - 1, "id"]);
      if (currentTitle) {
        const prevTitle = itemsById.getIn([prevId, "title"]);
        this.selectionStart = prevTitle.length;
        itemsById = itemsById.setIn(
          [order.getIn([i - 1, "id"]), "title"],
          prevTitle + currentTitle
        );
      }
      order = indentWithChildren(order, i - 1);
      order = updateHasChildrenForItem(order, i - 1);
      this.setState({ itemsById, order });
    }
  };
  onEnter = (id, selectionStart) => {
    let { itemsById, order } = this.state;
    const i = order.findIndex(item => item.get("id") === id);
    const currentItem = itemsById.get(id);
    let currTitle = currentItem.get("title");
    let nextTitle = "";
    if (selectionStart < currentItem.get("title").length) {
      nextTitle = currTitle.slice(selectionStart);
      currTitle = currTitle.slice(0, selectionStart);
      itemsById = itemsById.setIn([id, "title"], currTitle);
    }
    const newId = randomString(5);
    itemsById = itemsById.set(
      newId,
      fromJS({
        id: newId,
        title: nextTitle,
        type: "task"
      })
    );
    order = order.insert(
      i + 1,
      fromJS({
        id: newId,
        indent: order.getIn([i, "indent"])
      })
    );
    order = updateHasChildrenForItem(order, i + 1);
    this.focusI = i + 1;
    this.selectionStart = 0;
    if (selectionStart === 0 && !currTitle && nextTitle) {
      this.focusI = i;
    }
    this.setState({
      itemsById,
      order
    });
  };
  onCollapse = id => {
    const { order } = this.state;
    const i = order.findIndex(item => item.get("id") === id);
    this.setState({
      order: order.setIn([i, "collapsed"], !order.getIn([i, "collapsed"]))
    });
  };
  onSliderChange = e => {
    const depth = parseInt(e.target.value, 10);

    let { order } = this.state;
    order = order.map(item =>
      item.set("collapsed", item.get("indent") < depth)
    );
    this.setState({
      sliderValue: e.target.value,
      order
    });
  };
  componentDidUpdate() {
    if (typeof this.focusI === "number") {
      this.focusI = undefined;
      this.selectionStart = undefined;
    }
  }
  renderItems() {
    const { order, itemsById } = this.state;
    let blockUntilNextIndent = -1;
    return order.map((item, i) => {
      const indent = item.get("indent");
      if (blockUntilNextIndent > -1) {
        if (indent > blockUntilNextIndent) {
          return null;
        } else {
          blockUntilNextIndent = -1;
        }
      }
      if (item.get("hasChildren") && !item.get("collapsed")) {
        blockUntilNextIndent = indent;
      }
      return (
        <Item
          focus={i === this.focusI}
          selectionStart={i === this.focusI && this.selectionStart}
          item={itemsById.get(item.get("id"))}
          orderItem={item}
          key={item.get("id")}
          onUpArrow={this.onUpArrow}
          onDownArrow={this.onDownArrow}
          onEnter={this.onEnter}
          onDelete={this.onDelete}
          onTab={this.onTab}
          onChange={this.onChangeTitle}
          onCollapse={this.onCollapse}
        />
      );
    });
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
      </SW.Wrapper>
    );
  }
}
