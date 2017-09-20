import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TextInput, Platform } from 'react-native';
// import { bindAll } from 'swipes-core-js/classes/utils';
import { setupDelegate } from 'react-delegate';
import HOCSearchResults from './HOCSearchResults';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import { colors, viewSize } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    width: viewSize.width,
    height: 54,
    flexDirection: 'row',
    zIndex: 100,
    backgroundColor: colors.bgColor,
    borderTopWidth: 1,
    borderTopColor: colors.deepBlue10,
  },
  arrowIconWrapper: {
    width: 64,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0,
  },
  arrowIconSeperator: {
    width: 1,
    height: 40,
    position: 'absolute',
    right: 0,
    top: 7,
    backgroundColor: colors.deepBlue10,
  },
  inputHolder: {
    flex: 1,
    height: 54,
    alignSelf: 'stretch',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  inputWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.deepBlue10,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  clearInputWrapper: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyles: {
    flex: 1,
    fontSize: 13,
    color: colors.deepBlue100,
    paddingHorizontal: 18,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

class Search extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.clearInput = this.clearInput.bind(this);
    setupDelegate(this, 'onChange', 'onSearch', 'onPopNav');
  }
  componentDidMount() {
  }
  clearInput() {
    this.onChange('');
  }
  renderInput() {
    return (
      <View style={{ flexDirection: 'row', paddingTop: 30 }}>
        <TextInput
          onChangeText={this.onChange}
          value={this.props.searchString}
          placeholder="Search something"
          returnKeyType="search"
        />
      </View>
    );
  }
  renderResults() {
    const { toSearchString, delegate } = this.props;

    return (
      <HOCSearchResults
        searchString={toSearchString}
        delegate={delegate}
      />
    );
  }
  renderArrowIcon() {
    if (Platform.OS === 'android') return undefined;

    return (
      <RippleButton onPress={this.onPopNav}>
        <View style={styles.arrowIconWrapper}>
          <Icon name="ArrowLeftLine" width="24" height="24" fill={colors.deepBlue50} />
          <View style={styles.arrowIconSeperator} />
        </View>
      </RippleButton>
    );
  }
  renderClearInput() {
    if (!this.props.searchString.length) return undefined;

    return (
      <RippleButton
        style={{ width: 42, height: 42, overflow: 'hidden', borderRadius: 100, borderWidth: 1, borderColor: 'transparent' }}
        onPress={this.clearInput}
      >
        <View style={styles.clearInputWrapper} >
          <Icon name="Close" width="24" height="24" fill={colors.deepBlue100} />
        </View>
      </RippleButton>
    );
  }
  renderInput() {
    return (
      <View style={styles.inputHolder}>
        <View style={styles.inputWrapper} >
          <TextInput
           style={styles.inputStyles}
           onChangeText={this.onChange}
           value={this.props.searchString}
           placeholder="Search"
           returnKeyType="search"
           underlineColorAndroid="transparent"
           blurOnSubmit
           onSubmitEditing={this.onSearch}
           placeholderTextColor={colors.deepBlue50}
           autoFocus={true}
         />
         {this.renderClearInput()}
       </View>
      </View>
    );
  }
  renderFooter() {
    return (
      <View style={styles.footer}>
        {this.renderArrowIcon()}
        {this.renderInput()}
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderResults()}
        {this.renderFooter()}
      </View>
    );
  }
}

export default Search;

// const { string } = PropTypes;

Search.propTypes = {};
