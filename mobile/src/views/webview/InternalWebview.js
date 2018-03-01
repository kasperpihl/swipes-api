import React, { Component } from 'react';
import { View, Text, WebView, StyleSheet } from 'react-native';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import { colors, viewSize } from 'globalStyles';

class InternalWebview extends Component {
  constructor(props) {
    super(props);

    this.closeWebview = this.closeWebview.bind(this);
  }
  closeWebview() {
    const { onPopRoute } = this.props;

    onPopRoute();
  }
  renderNavBar() {
    return (
      <View style={styles.navbar}>
        <RippleButton onPress={this.closeWebview}>
          <View style={styles.icon}>
            <Icon icon="Close" width="24" height="24" fill={colors.deepBlue80} />
          </View>
        </RippleButton>
        <View style={styles.titleWrap}>
          <Text>{this.props.title}</Text>
        </View>
      </View>
    );
  }
  render() {
    return (
      <View style={styles.container}>
        {this.renderNavBar()}
        <WebView
          source={{ uri: this.props.url }}
          style={{ flex: 1 }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
  },
  navbar: {
    width: viewSize.width,
    height: 80,
    backgroundColor: colors.deepBlue10,
    flexDirection: 'row',
    elevation: 2,
  },
  icon: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default InternalWebview;
