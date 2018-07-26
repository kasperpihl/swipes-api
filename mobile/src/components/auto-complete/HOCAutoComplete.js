import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as ca from '../../../swipes-core-js/actions';
import * as cs from '../../../swipes-core-js/selectors';
import AutoComplete from './AutoComplete';

class HOCAutoComplete extends PureComponent {
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
};

export default connect(state => ({
  autoComplete: state.autoComplete,
  results: state.autoComplete.get('string') && cs.autoComplete.getResults(state),
}), {
  clear: ca.autoComplete.clear,
  search: ca.autoComplete.search,
})(HOCAutoComplete);
