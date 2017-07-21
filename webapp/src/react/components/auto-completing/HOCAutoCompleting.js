import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as cs from 'swipes-core-js/selectors';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AutoCompleting from './AutoCompleting';

class HOCAutoCompleting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { autoComplete, results } = this.props;

    return (
      <AutoCompleting
        results={results}
        autoComplete={autoComplete}
        delegate={this}
      />
    );
  }
}
// const { string } = PropTypes;

HOCAutoCompleting.propTypes = {};

function mapStateToProps(state) {
  return {
    autoComplete: state.get('autoComplete'),
    results: state.getIn(['autoComplete', 'string']) && cs.autoComplete.getResults(state),
  };
}

export default connect(mapStateToProps, {

})(HOCAutoCompleting);
