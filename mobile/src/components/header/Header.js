import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { setupDelegate, setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import Tabs from 'react-native-tabs';
import { colors } from '../../utils/globalStyles';

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {};

    this.callDelegate = setupDelegate(props.delegate);
  }
  componentWillMount() {
    const { tabs, currentTab } = this.props;

    if (tabs) {
      tabs.forEach((t, i) => {
        if (i === currentTab) {
          this.setState({page: i})
        }
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    const { currentTab } = this.props;
    this.setState({ page: nextProps.currentTab })
  }
  renderTabs() {
    const { tabs } = this.props;

    if (!tabs) {
      return undefined;
    }

    const renderTabs = tabs.map((t, i) => {
      return (
        <Text name={i} key={i} style={styles.tabTitle}>{t}</Text>
      )
    })

    console.log('page', this.state.page)

    return (
      <Tabs
        selected={this.state.page}
        style={{ backgroundColor: 'white', height: 50 }}
        selectedStyle={{ color: colors.deepBlue100 }}
        onSelect={(el) => this.callDelegate('onChangeTab', el.props.name)}>
        {renderTabs}
      </Tabs>
    )
  }
  render() {
    const { tabs } = this.props

    let containerStyles = tabs ? styles.containerWithtabs : styles.container;

    return (
      <View style={containerStyles}>
        <Text style={styles.title}>{this.props.title}</Text>
        {this.renderTabs()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue20,
    backgroundColor: colors.bgColor,
  },
  containerWithtabs: {
    paddingVertical: 30,
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue20,
    backgroundColor: colors.bgColor,
    paddingBottom: 60
  },
  title: {
    color: colors.deepBlue100,
    fontSize: 30,
  },
  tabTitle: {
    color: colors.deepBlue30,
    fontWeight: '500'
  }
});

export default Header;
