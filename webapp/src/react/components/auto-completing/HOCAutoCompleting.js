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
    const value = e.target.value;
    const position = this.getCaretPosition(e.target);

    let string = value.substr(0, position);
    string = string.split('\n').reverse()[0];
    let array = string.split(` ${options.trigger}`);
    if(array.length > 1) {
      string = array[array.length - 1];
    } else if(array[0].startsWith(`${options.trigger}`)) {
      string = array[0].substr(1);
    } else {
      string = undefined;
    }
    if(string) {
      search(string, options.types, e.target.getBoundingClientRect(), options.delegate);
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
    const delegate = autoComplete.get('delegate');
    if(delegate && typeof delegate.onAutoCompleteSelect === 'function' && results.length) {
      delegate.onAutoCompleteSelect(results[i].item);
    }
    clear();
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
    } else if (document.selection && document.selection.createRange) {
      range = document.selection.createRange();
      if (range.parentElement() == editableDiv) {
        var tempEl = document.createElement("span");
        editableDiv.insertBefore(tempEl, editableDiv.firstChild);
        var tempRange = range.duplicate();
        tempRange.moveToElementText(tempEl);
        tempRange.setEndPoint("EndToEnd", range);
        caretPos = tempRange.text.length;
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
