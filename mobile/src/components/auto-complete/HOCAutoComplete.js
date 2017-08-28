import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as ca from '../../../swipes-core-js/actions';
// import * s from 'selectors';
import * as cs from '../../../swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AutoComplete from './AutoComplete';

class HOCAutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupLoading(this);
  }
  componentDidMount() {
  }
  render() {
    const { autoComplete, results } = this.props;
    return (
      <AutoComplete
        results={results}
        autoComplete={autoComplete}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCAutoComplete.propTypes = {};

const mapStateToProps = state => ({
  autoComplete: state.get('autoComplete'),
  results: state.getIn(['autoComplete', 'string']) && cs.autoComplete.getResults(state),
});

export default connect(mapStateToProps, {
  clear: ca.autoComplete.clear,
  search: ca.autoComplete.search,
})(HOCAutoComplete);
