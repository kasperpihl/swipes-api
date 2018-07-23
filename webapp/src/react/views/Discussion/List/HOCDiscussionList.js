import React, { PureComponent } from 'react';
import DiscussionList from './DiscussionList';
import { discussionList } from 'src/redux/cache/cacheSelectors';
import PaginationProvider from 'src/react/components/pagination/PaginationProvider';

export default class HOCDiscussionList extends PureComponent {
  render() {
    const { activeItem } = this.props;
    let type = 'following';
    if(activeItem === 1) type = 'all other';
    else if(activeItem === 2) type = 'by me';

    return (
      <PaginationProvider selector={discussionList} options={{
        body: {
          type,
        },
        url: 'discussion.list',
        resPath: 'discussions',
        limit: 10,
      }}>
        <DiscussionList setActiveItem={this.props.setActiveItem}/>
      </PaginationProvider>
    );
  }
}