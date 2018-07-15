import React, { PureComponent } from 'react';
import { styleSheet } from 'swiss-react';
import withPagination from './withPagination';

const SW = styleSheet('PaginationScrollToMore', {
  Wrapper: {
    background: 'red',
    height: '10px',
  }
});

@withPagination
export default class PaginationScrollToMore extends PureComponent {
  componentDidMount() {
    document.addEventListener('scroll', this.checkForMore, true);
    this.checkForMore();
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.checkForMore); 
  }
  componentDidUpdate() {
    this.checkForMore();
  }
  checkForMore = () => {
    const { loading, results, hasMore, loadMore } = this.props.pagination;
    if(!loading && hasMore && this.isElementOnScreen()) {
      loadMore();
    }
  }
  isElementOnScreen() {
    const rect = this.wrapper.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  render() {
    return (
      <SW.Wrapper innerRef={(e) => this.wrapper = e}/>
    );
  }
}
