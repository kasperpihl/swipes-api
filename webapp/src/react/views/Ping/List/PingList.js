import React, { PureComponent } from 'react';
import PingComposer from '../Composer/PingComposer';
import PingListItem from './Item/PingListItem';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';
import withPagination from 'swipes-core-js/components/pagination/withPagination';
import SW from './PingList.swiss';

@withPagination
export default class extends PureComponent {
  renderItems() {
    const { results } = this.props.pagination;
    return (results || []).map((item, i) => (
      <PingListItem item={item} key={i}/>
    ));
  }
  render() {
    return (
      <SW.Wrapper>
        <PingComposer setActiveItem={this.props.setActiveItem}/>
        <SW.ItemWrapper>
          {this.renderItems()}
          <PaginationScrollToMore errorLabel="Couldn't get pings." />
        </SW.ItemWrapper>
      </SW.Wrapper>
    );
  }
}
