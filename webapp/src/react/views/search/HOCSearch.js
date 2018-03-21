import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import navWrapper from 'src/react/app/view-controller/NavWrapper';
import Search from './Search';

class HOCSearch extends PureComponent {
  static minWidth() {
    return 600;
  }
  static maxWidth() {
    return 660;
  }
  constructor(props) {
    super(props);
    const { savedState } = this.props;
    const initialScroll = (savedState && savedState.get('scrollTop')) || 0;
    const initialSearchString = (savedState && savedState.get('searchString')) || '';
    this.state = {
      searchString: initialSearchString,
      initialScroll,
      limit: 25,
    };
    // setupLoading(this);
  }
  onChange(e) {
    this.setState({ searchString: e.target.value  });
  }
  onScroll(e) {
    this._scrollTop = e.target.scrollTop;
  }
  willOpenResult(id) {
    this.saveState();
  }
  saveState() {
    const { saveState } = this.props;
    const { searchString } = this.state;
    const savedState = {
      searchString,
      scrollTop: this._scrollTop,
    }; // state if this gets reopened
    saveState(savedState);
  }
  render() {
    const { searchString, limit, initialScroll }  = this.state;

    return (
      <Search
        searchString={searchString}
        initialScroll={initialScroll}
        delegate={this}
        limit={limit}
      />
    );
  }
}
// const { string } = PropTypes;

HOCSearch.propTypes = {};

function mapStateToProps() {
  return {};
}

export default navWrapper(connect(mapStateToProps, {
})(HOCSearch));
