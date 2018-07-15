import React, { PureComponent } from 'react';
import PingComposer from '../Composer/PingComposer';
import PingListItem from './Item/PingListItem';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';
import withPagination from 'src/react/components/pagination/withPagination';
import SW from './PingList.swiss';

@withPagination
export default class extends PureComponent {
  renderItems() {
    const { results } = this.props.pagination;
    if(!results) return 'Loading...';
    return this.props.pagination.results.map((item, i) => (
      <PingListItem item={item} key={i}/>
    ));
  }
  render() {
    return (
      <SW.Wrapper>
        <PingComposer />
        <SW.ItemWrapper>
          {this.renderItems()}
          <PaginationScrollToMore />
        </SW.ItemWrapper>
      </SW.Wrapper>
    );
  }
}
