import React, { PureComponent } from 'react';
import { View } from 'react-native';
import { setupDelegate } from 'react-delegate';

class AutoCompleteItem extends PureComponent {
  constructor(props) {
    super(props);
    setupDelegate(this, 'onAutoCompleteItemPress');
  }
  componentDidMount() {
  }
  render() {
    return (
      <View />
    );
  }
}

export default AutoCompleteItem;
