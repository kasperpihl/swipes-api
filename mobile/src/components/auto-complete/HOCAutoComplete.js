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
  onChange(e, options) {
    const { results, clear, search, autoComplete } = this.props;
    const value = this.getValue(e.target);
    const position = this.getCaretPosition(e.target);
    let string = value.substr(0, position);
    string = string.split('\n').reverse()[0];
    let array = string.split(`${options.trigger}`);
    if(array.length > 1) {
      string = array[array.length - 1];
    } else {
      string = undefined;
    }
    if(string) {
      search(string, options);
    } else if(autoComplete.get('string')) {
      clear();
    }
    //return false;
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
