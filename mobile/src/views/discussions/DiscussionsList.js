import React, { PureComponent } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import PaginationProvider from '@swipesapp/core/dist/components/pagination/PaginationProvider';

export default class DiscussionsList extends PureComponent {
  render() {
    const { activeItem, myId } = this.props;
    let type = 'following';
    let filter = (d) => d.get('subscription');
    if(activeItem === 1) {
      type = 'all other';
      filter = d => !d.get('subscription');
    }
    else if(activeItem === 2) {
      type = 'by me';
      filter = d => d.get('created_by') === myId
    }
    return (
      <View>
        <PaginationProvider
          request={{
            body: { type },
            url: 'discussion.list',
            resPath: 'discussions',
          }}
          cache={{
            path: 'discussion',
            filter,
            orderBy: '-last_comment_at',
          }}>
          {pagination => (
            <FlatList
              onEndReached={this.onEndReached}
              onEndReachedThreshold={0.1}
              data={pagination.results}
              renderItem={({ item }) => <Text style={styles.item}>{item.key}</Text>}
            />
          )}
        </PaginationProvider>
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