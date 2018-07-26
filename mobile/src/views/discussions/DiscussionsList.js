import React, { PureComponent } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';

class DiscussionsList extends PureComponent {
  constructor(props) {
    super(props);
  }

  // onEndReached() {
  // }

  render() {
    return (
      <View>
        <FlatList
          onEndReached={this.onEndReached}
          onEndReachedThreshold={0.1}
          data={[{ key: 'blabla' }]}
          renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});

export default DiscussionsList;
