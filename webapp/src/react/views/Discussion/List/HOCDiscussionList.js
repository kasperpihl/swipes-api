import React, { PureComponent } from 'react';
import DiscussionList from './DiscussionList';
import { discussionList } from 'src/redux/cache/cacheSelectors';
import PaginationProvider from 'src/react/components/pagination/PaginationProvider';
import { connect } from 'react-redux';

@connect(state => ({
  myId: state.getIn(['me', 'id']),
}))
export default class HOCDiscussionList extends PureComponent {
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
      filter = d => d.get('sent_by') === myId
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