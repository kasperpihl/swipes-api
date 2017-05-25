import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import ImmutableListView from 'react-native-immutable-list-view';
import ActionModalItem from './ActionModalItem';

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

class ActionModalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.renderlistItem = this.renderlistItem.bind(this);
  }
  renderlistItem(item) {
    const { multiple, delegate } = this.props;
    console.log();
    return <ActionModalItem item={item} multiple={multiple} delegate={delegate} />;
  }
  render() {
    const { selectedItems, listItems } = this.props;
    return (
      <ImmutableListView
        style={styles.list}
        immutableData={listItems.map((item) => {
          item.selected = selectedItems.includes(item.index);

          return Object.assign({}, item);
        })}
        renderRow={this.renderlistItem}
      />
    );
  }
}


export default ActionModalList;
