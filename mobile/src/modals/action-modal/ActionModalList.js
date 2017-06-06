import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ImmutableVirtualizedList from 'react-native-immutable-list-view';
import ActionModalItem from './ActionModalItem';

const styles = StyleSheet.create({
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
  nonScrollableList: {
    alignSelf: 'stretch',
  },
});

class ActionModalList extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.renderlistItem = this.renderlistItem.bind(this);
  }
  renderList() {
    const { listItems, multiple, delegate } = this.props;

    const listItemsRender = listItems.map((lI, i) => <ActionModalItem key={i} singleRender item={lI} multiple={multiple} delegate={delegate} />);

    return (
      <View style={styles.nonScrollableList}>
        {listItemsRender}
      </View>
    );
  }
  renderlistItem(item) {
    const { multiple, delegate } = this.props;
    return <ActionModalItem item={item} multiple={multiple} delegate={delegate} />;
  }
  render() {
    const { listItems, multiple, scrollable, fullscreen } = this.props;

    if (scrollable || fullscreen) {
      return (
        <ImmutableVirtualizedList
          style={styles.list}
          keyboardShouldPersistTaps="always"
          immutableData={listItems}
          renderRow={this.renderlistItem}
        />
      );
    }

    return this.renderList();
  }
}


export default ActionModalList;
