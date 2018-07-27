import React, { PureComponent } from 'react';
import DiscussionList from './DiscussionList';
import PaginationProvider from 'swipes-core-js/components/pagination/PaginationProvider';
import { connect } from 'react-redux';

@connect(state => ({
  myId: state.me.get('id'),
}))
export default class HOCDiscussionList extends PureComponent {
  render() {
    const { activeItem, myId } = this.props;
    let type = 'following';
    let filter = (d) => d.get('followers').find(o => o.get('user_id') === myId);
    if(activeItem === 1) {
      type = 'all other';
      filter = d => !d.get('followers').find(o => o.get('user_id') === myId);
    }
    else if(activeItem === 2) {
      type = 'by me';
      filter = d => d.get('created_by') === myId
    }
    return (
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
        <DiscussionList setActiveItem={this.props.setActiveItem}/>
      </PaginationProvider>
    );
  }
}