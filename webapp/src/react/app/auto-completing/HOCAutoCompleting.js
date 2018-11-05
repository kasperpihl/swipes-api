import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as cs from 'swipes-core-js/selectors';
import * as ca from 'swipes-core-js/actions';
import AutoCompleting from './AutoCompleting';

@connect(
  state => ({
    autoComplete: state.autoComplete,
  }),
  {
    clear: ca.autoComplete.clear,
    blockIdentifier: ca.autoComplete.blockIdentifier,
    search: ca.autoComplete.search,
  }
)
export default class HOCAutoCompleting extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      alignToTop: true,
    };
  }
  componentDidMount() {
    window.addEventListener('keydown', this.makeHandleKey('onKeyDown'));
    window.addEventListener('keyup', this.makeHandleKey('onKeyUp'));
  }
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }
  componentWillReceiveProps(nextProps) {
    const { autoComplete } = this.props;
    if (autoComplete.get('results') !== nextProps.autoComplete.get('results')) {
      this.setState({ selectedIndex: 0 });
    }
  }
  makeHandleKey(event) {
    return e => {
      if (!this.props.autoComplete.get('results')) {
        return;
      }
      const handled = this[event](e);
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
  }
  onKeyDown(e) {
    const { clear, autoComplete, blockIdentifier } = this.props;
    const { selectedIndex } = this.state;
    if ([38, 40].indexOf(e.keyCode) !== -1) {
      const results = autoComplete.get('results');

      let alignToTop = e.keyCode === 38;
      let modifier = e.keyCode === 38 ? -1 : 1;
      const showOnTop = autoComplete.getIn(['options', 'showOnTop']);
      modifier = showOnTop ? -modifier : modifier;
      let newSelected = selectedIndex + modifier;
      if (newSelected < 0) {
        newSelected = results.length - 1;
        alignToTop = true;
      } else if (newSelected >= results.length) {
        newSelected = 0;
        alignToTop = false;
      }
      this.setState({ selectedIndex: newSelected, alignToTop });
      return true;
    }
    if (e.keyCode === 27) {
      clear();
      if (autoComplete.getIn(['options', 'identifier'])) {
        blockIdentifier(autoComplete.getIn(['options', 'identifier']));
      }
      return true;
    }
    if (e.keyCode === 13) {
      return true;
    }
    return false;
  }
  onKeyUp(e) {
    const { selectedIndex } = this.state;
    if (e.keyCode === 13) {
      this.onSelectRow(selectedIndex);
      return true;
    }
    return false;
  }
  onSelectRow(i) {
    const { clear, autoComplete } = this.props;
    const delegate = autoComplete.getIn(['options', 'delegate']);
    const results = autoComplete.get('results');
    if (delegate && typeof delegate.onAutoCompleteSelect === 'function') {
      delegate.onAutoCompleteSelect(results[i].item);
    }
    clear();
  }
  render() {
    const { autoComplete } = this.props;
    const { selectedIndex, alignToTop } = this.state;
    return (
      <AutoCompleting
        selectedIndex={selectedIndex}
        alignToTop={alignToTop}
        autoComplete={autoComplete}
        delegate={this}
      />
    );
  }
}
