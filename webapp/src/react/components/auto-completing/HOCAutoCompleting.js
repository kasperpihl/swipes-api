import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
import * as cs from 'swipes-core-js/selectors';
import * as ca from 'swipes-core-js/actions';
import { bindAll } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import AutoCompleting from './AutoCompleting';

class HOCAutoCompleting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      alignToTop: true,
    };
    bindAll(this, ['onKeyDown', 'onKeyUp']);
  }
  componentWillReceiveProps(nextProps) {
    const { results } = this.props;
    const nextResults = nextProps.results;
    if(results !== nextResults) {
      this.setState({ selectedIndex: 0 });
    }
    if(!results && nextResults){
      window.addEventListener('keyup', this.onKeyUp);
      window.addEventListener('keydown', this.onKeyDown);
    }
    if(results && !nextResults) {
      window.removeEventListener('keyup', this.onKeyUp);
      window.removeEventListener('keydown', this.onKeyDown);
    }
  }
  onKeyDown(e) {
    const { selectedIndex } = this.state;
    const { results, clear, autoComplete } = this.props;
    if([38, 40].indexOf(e.keyCode) !== -1){
      e.preventDefault();
      e.stopPropagation();
      let alignToTop = (e.keyCode === 38);
      const modifier = (e.keyCode === 38) ? 1 : -1;
      let newSelected = selectedIndex + modifier;
      if(newSelected < 0) {
        newSelected = results.length - 1;
        alignToTop = true;
      } else if (newSelected >= results.length) {
        newSelected = 0;
        alignToTop = false;
      }
      this.setState({ selectedIndex : newSelected, alignToTop });
    }
    if(e.keyCode === 27) {
      clear();
      e.preventDefault();
      e.stopPropagation();
    }
    if(e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
    }
  }
  onKeyUp(e) {
    const { selectedIndex } = this.state;
    const { clear } = this.props;
    if(e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      this.onSelectRow(selectedIndex);
      clear();
    }
  }
  onSelectRow(i) {
    const { clear, results, autoComplete } = this.props;
    const delegate = autoComplete.get('delegate');
    if(delegate && typeof delegate.onAutoCompleteSelect === 'function' && results.length) {
      delegate.onAutoCompleteSelect(results[i].item);
    }
    clear();
  }
  render() {
    const { autoComplete, results } = this.props;
    const { selectedIndex, alignToTop } = this.state;

    return (
      <AutoCompleting
        results={results}
        selectedIndex={selectedIndex}
        alignToTop={alignToTop}
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
  clear: ca.autoComplete.clear,
})(HOCAutoCompleting);
