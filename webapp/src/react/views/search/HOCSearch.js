import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import * s from 'selectors';
// import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import Search from './Search';

class HOCSearch extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
    };
    // setupLoading(this);
  }
  componentDidMount() {
  }
  onChange(e) {
    this.setState({ searchString: e.target.value });
  }
  render() {
    const { searchString } = this.state;

    return (
      <Search
        searchString={searchString}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCSearch.propTypes = {};

function mapStateToProps() {
  return {};
}

export default connect(mapStateToProps, {
})(HOCSearch);
