import React, { PureComponent } from 'react';
import { View } from 'react-native';
import AutoCompleteItem from './AutoCompleteItem';

class AutoComplete extends PureComponent {
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

export default AutoComplete;
