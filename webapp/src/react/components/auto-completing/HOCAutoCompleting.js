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
    // bindAll(this, ['onKeyDown', 'onKeyUp', 'onChan']);
  }
  componentDidMount() {
    window.AC = this;
  }
  componentWillReceiveProps(nextProps) {
    const { results } = this.props;
    if(results !== nextProps.results) {
      this.setState({ selectedIndex: 0 });
    }
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
  onKeyDown(e, options) {
    const { results, clear, autoComplete } = this.props;
    if(!results) {
      return false;
    }
    const { selectedIndex } = this.state;

    if([38, 40].indexOf(e.keyCode) !== -1){
      let alignToTop = (e.keyCode === 38);
      let modifier = (e.keyCode === 38) ? -1 : 1;
      const showOnTop = autoComplete.getIn(['options', 'showOnTop']);
      modifier = showOnTop ? -modifier : modifier;
      let newSelected = selectedIndex + modifier;
      if(newSelected < 0) {
        newSelected = results.length - 1;
        alignToTop = true;
      } else if (newSelected >= results.length) {
        newSelected = 0;
        alignToTop = false;
      }
      this.setState({ selectedIndex : newSelected, alignToTop });
      return true;
    }
    if(e.keyCode === 27) {
      clear();
      return true;
    }
    if(e.keyCode === 13) {
      return true;
    }
    return false;
  }
  onKeyUp(e, options) {
    const { results, clear } = this.props;
    if(!results) {
      return false;
    }

    const { selectedIndex } = this.state;
    if(e.keyCode === 13) {
      this.onSelectRow(selectedIndex);
      return true;
    }
    return false;
  }
  onBlur() {
    const { clear } = this.props;
    clear();
    return false;
  }
  onSelectRow(i) {
    const { clear, results, autoComplete } = this.props;
    const delegate = autoComplete.getIn(['options', 'delegate']);
    if(delegate && typeof delegate.onAutoCompleteSelect === 'function' && results.length) {
      delegate.onAutoCompleteSelect(results[i].item);
    }
    clear();
  }
  getValue(target) {
    const sel = window.getSelection();
    if(target.nodeName === 'INPUT') {
      return target.value;
    }
    return sel.anchorNode.textContent;
  }
  getCaretPosition(editableDiv) {
    if(typeof editableDiv.selectionStart !== 'undefined'){
      return editableDiv.selectionStart;
    }
    var caretPos = 0,
      sel, range;
    if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0);
        if (range.commonAncestorContainer.parentNode == editableDiv) {
          caretPos = range.endOffset;
        }
      }
    }

    return caretPos;
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
  search: ca.autoComplete.search,
})(HOCAutoCompleting);
