import React, { PureComponent } from 'react';
import DiscussionListItem from './Item/DiscussionListItem';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';
import withPagination from 'src/react/components/pagination/withPagination';

import SW from './DiscussionList.swiss';
import ActionBar from './ActionBar';

@withPagination
export default class extends PureComponent {
  renderItems() {
    const { results } = this.props.pagination;
    return (results || []).map((item, i) => (
      <DiscussionListItem item={item} key={i}/>
    ));
  }
  render() {
    return (
      <SW.Wrapper>
        {this.renderItems()}
        <PaginationScrollToMore errorLabel="Couldn't get discussions." />
        <ActionBar />
      </SW.Wrapper>
    );
  }
}
