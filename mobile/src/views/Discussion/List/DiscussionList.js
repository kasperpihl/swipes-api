import React, { PureComponent } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';

@connect(state => ({
  counter: state.counter.get('discussion'),
  myId: state.me.get('id'),
}), {
  apiRequest: ca.api.request,
})
export default class DiscussionList extends PureComponent {
  onInitialLoad = () => {
    // T_TODO: tabIndex should probably not be static.
    const { apiRequest, counter } = this.props;
    const tabIndex = 0;
    if(tabIndex === 0 && counter && counter.size) {
      apiRequest('me.clearCounter', {
        type: 'discussion',
        cleared_at: counter.first().get('ts'),
      });
    }
  }
  render() {
    // T_DODO: tabIndex should probably not be static.
    const { myId } = this.props;
    const tabIndex = 0;
    let type = 'following';
    let filter = d => d.get('followers').find(o => o.get('user_id') === myId);
    if (tabIndex === 1) {
      type = 'all other';
      filter = d => !d.get('followers').find(o => o.get('user_id') === myId);
    } else if (tabIndex === 2) {
      type = 'by me';
      filter = d => d.get('created_by') === myId;
    }

    return (
      <View>
        <PaginationProvider
          request={{
            body: { type },
            url: 'discussion.list',
            resPath: 'discussions',
          }}
          onInitialLoad={this.onInitialLoad}
          cache={{
            path: 'discussion',
            filter,
            orderBy: '-last_comment_at',
          }}
        >
          {(p) => {
            console.log(p.results ? p.results.map(o => o.set('key', o.get('id'))).toList().toJS() : []);
            return (
              <FlatList
                onEndReached={this.onEndReached}
                onEndReachedThreshold={0.1}
                data={p.results ? p.results.map(o => o.set('key', o.get('id'))).toList().toJS() : []}
                renderItem={({ item }) => { console.log(item); return <Text style={styles.item}>{item.title}</Text>; }}
              />
            );
          }
          }
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
