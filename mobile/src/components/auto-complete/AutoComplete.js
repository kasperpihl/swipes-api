import React, { PureComponent } from 'react';
import { View } from 'react-native';
// import PropTypes from 'prop-types';
// import { map, list } from 'react-immutable-proptypes';
// import { bindAll, setupDelegate, setupCachedCallback } from 'swipes-core-js/classes/utils';
// import SWView from 'SWView';
// import Button from 'Button';
// import Icon from 'Icon';
// import './styles/AutoComplete.scss';
import AutoCompleteItem from './AutoCompleteItem';

class AutoComplete extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderResults() {
    const { autoComplete, results, delegate } = this.props;
    return results.map((res, i) => (
      <AutoCompleteItem
        key={autoComplete.get('string') + i}
        {...res.resultItem}
        delegate={delegate}
      />
    ))
  }
  render() {
    const { autoComplete, results } = this.props;
    if(!results || !results.length) {
      return null;
    }
    const bottom = autoComplete.getIn(['options', 'bottom']) || 0;

    return (
      <View>
        {this.renderResults()}
      </View>
    );
  }
}

export default AutoComplete

// const { string } = PropTypes;

AutoComplete.propTypes = {};
