import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, UIManager, LayoutAnimation } from 'react-native';
import { connect } from 'react-redux';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import Tabs from '../tabs/Tabs';
import { colors } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    paddingTop: 39,
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

class HOCHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

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
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
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
    const { tabs, children, collapsed } = this.props;

    let marginTop = 0;

    if (collapsed) {
      marginTop = -100;
    }

    return (
      <View style={[styles.container, { marginTop }]}>
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


function mapStateToProps(state) {
  return {
    collapsed: state.getIn(['navigation', 'collapsed']),
  };
}

export default connect(mapStateToProps, {

})(HOCHeader);
