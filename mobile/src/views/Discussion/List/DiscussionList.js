import React, { PureComponent } from 'react';
import { View, FlatList } from 'react-native';
import { connect } from 'react-redux';
import * as ca from 'swipes-core-js/actions';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import SW from './DiscussionList.swiss';

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

  onEndReached(p) {
    console.log('end of list');
    console.log(p);
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
          limit={1}
          cache={{
            path: 'discussion',
            filter,
            orderBy: '-last_comment_at',
          }}
        >
          {(p) => {
            console.log(p)
            // console.log(p.results ? p.results.map(o => o.set('key', o.get('id'))).toList().toJS() : []);
            return (
              <FlatList
                onEndReached={() => this.onEndReached(p)}
                onEndReachedThreshold={0}
                data={p.results ? p.results.map(o => o.set('key', o.get('id'))).toList().toJS() : []}
                renderItem={({ item }) => <SW.ListItem>{item.topic}</SW.ListItem>}
              />
            );
          }
          }
        </PaginationProvider>
      </View>
    );
  }
}