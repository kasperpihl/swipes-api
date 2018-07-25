import React, { PureComponent } from 'react';
import { styleSheet } from 'swiss-react';
import withPagination from 'swipes-core-js/components/pagination/withPagination';
import Loader from 'src/react/components/loaders/Loader';
import Button from 'src/react/components/button/Button';

const SW = styleSheet('PaginationScrollToMore', {
  Wrapper: {
    minHeight: '54px',
  },
  LoadWrapper: {
    padding: '12px',
    _flex: ['row', 'left', 'center'],
  },
  LoadLabel: {
    paddingLeft: '12px',
  },
  ErrorLabel: {
    // color: '$red',
    paddingRight: '12px',
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
    const { loading, results, hasMore, loadMore, error } = this.props.pagination;
    if(!loading && hasMore && !error && this.isElementOnScreen()) {
      loadMore();
    }
  }
  onReload = () => {
    const { loadMore } = this.props.pagination;
    loadMore();
  }
  isElementOnScreen() {
    if(!this.wrapper) {
      return false;
    }
    const rect = this.wrapper.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  render() {
    const { pagination } = this.props;

    return (
      <SW.Wrapper
        innerRef={(e) => this.wrapper = e}>
        {pagination.loading && (
          <SW.LoadWrapper>
            <Loader mini size={30} />
            <SW.LoadLabel>Loading...</SW.LoadLabel>
          </SW.LoadWrapper>
        )}
        {pagination.error && (
          <SW.LoadWrapper>
            <SW.ErrorLabel>
              {this.props.errorLabel || 'Something went wrong'}
            </SW.ErrorLabel>
            <Button icon="Reload" onClick={this.onReload} />
          </SW.LoadWrapper>
        )}
          
      </SW.Wrapper>
    );
  }
}
