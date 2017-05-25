import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { setupDelegate, setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import Tabs from '../tabs/Tabs';
import { colors } from '../../utils/globalStyles';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    setupDelegate(this);
    this.onSelect = this.onSelect.bind(this);
  }
  componentWillMount() {
    const { tabs, currentTab, routes } = this.props;

    if (tabs) {
      tabs.forEach((t, i) => {
        if (i === currentTab) {
          this.setState({ page: i });
        }
      });
    }
  }
  componentWillReceiveProps(nextProps) {
    const { currentTab } = this.props;
    this.setState({ page: nextProps.currentTab });
  }
  onSelect(el) {
    this.callDelegate('onChangeTab', el.props.name);
  }
  renderTabs() {
    const { tabs } = this.props;

    if (!tabs) {
      return undefined;
    }

    const renderTabs = tabs.map((t, i) => (
      <Text name={i} key={i} style={styles.tabTitle}>{t}</Text>
    ));

    return (
      <Tabs
        selected={this.state.page}
        selectedStyle={{ color: colors.deepBlue100 }}
        onSelect={this.onSelect}
      >
        {renderTabs}
      </Tabs>
    );
  }
  render() {
    const { tabs, children } = this.props;

    const containerStyles = tabs ? styles.containerWithtabs : styles.container;

    return (
      <View style={containerStyles}>
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{this.props.title}</Text>
          <View style={styles.titleChildren}>
            {children}
          </View>
        </View>
        {this.renderTabs()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    marginHorizontal: 15,
    paddingTop: 54,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue20,
    backgroundColor: colors.bgColor,
  },
  containerWithtabs: {
    marginHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue20,
    backgroundColor: colors.bgColor,
    paddingTop: 54,
  },
  titleWrapper: {
    height: 50,
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleChildren: {
  },
  title: {
    flex: 1,
    color: colors.deepBlue100,
    fontSize: 30,
  },
  tabTitle: {
    color: colors.deepBlue30,
    fontWeight: '500',
  },
  breadcrumbs: {
    flexDirection: 'row',
    position: 'absolute',
    top: 33,
  },
  breadcrumb: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  breadcrumbLabel: {
    flexDirection: 'row',
    marginTop: -2,
    color: colors.deepBlue30,
    fontSize: 12,
  },
});

export default Header;
