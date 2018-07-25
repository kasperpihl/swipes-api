import React, { PureComponent } from 'react';
import { fromJS } from 'immutable';
import DiscussionListItem from './Item/DiscussionListItem';
import PaginationScrollToMore from 'src/react/components/pagination/PaginationScrollToMore';

import withPagination from 'swipes-core-js/components/pagination/withPagination';
import SW from './DiscussionList.swiss';
import ActionBar from './ActionBar';

@withPagination
export default class DiscussionList extends PureComponent {
  renderItems() {
    const { results } = this.props.pagination;
    return (results || fromJS([])).map((item, i) => (
      <DiscussionListItem item={item.toJS()} key={i}/>
    )).toArray();
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
