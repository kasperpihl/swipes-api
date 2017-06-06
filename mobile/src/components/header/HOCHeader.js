import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import Tabs from '../tabs/Tabs';
import { colors } from '../../utils/globalStyles';

class Header extends PureComponent {
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

    return (
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>{this.props.title}</Text>
          <View style={styles.children}>
            {children}
          </View>
        </View>
        <ScrollView style={styles.bottomContainer} horizontal showsHorizontalScrollIndicator={false} alwaysBounceHorizontal={false} >
          {this.renderTabs()}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 39,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue20,
    backgroundColor: colors.bgColor,
  },
  topContainer: {
    flexDirection: 'row',
    marginBottom: 9,
  },
  bottomContainer: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    color: colors.deepBlue100,
    fontSize: 27,
  },
  children: {
    flexDirection: 'row',
  },
  tabTitle: {
    color: colors.deepBlue30,
    fontWeight: '500',
  },
});

export default Header;
