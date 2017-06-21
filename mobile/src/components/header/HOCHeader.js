import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { setupDelegate } from '../../../swipes-core-js/classes/utils';
import Tabs from '../tabs/Tabs';
import { colors } from '../../utils/globalStyles';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    paddingTop: 33,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue100,
    backgroundColor: colors.bgColor,
  },
  topContainer: {
    flexDirection: 'row',
  },
  bottomContainer: {
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    color: colors.deepBlue100,
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 36,
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
    this.state = {
      headerHeight: 0,
    };

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
  measureView(event) {
    this.getHeaderHeight(event.nativeEvent.layout.height);
  }
  getHeaderHeight(height) {
    const { headerHeight } = this.state;

    if (headerHeight !== height) {
      this.setState({ headerHeight: height });
    }
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
    const { headerHeight } = this.state;
    const { tabs, children, collapsed } = this.props;

    let marginTop = 0;
    let paddingBottom = 0;

    if (collapsed) {
      marginTop = -headerHeight;
    }

    if (!tabs) {
      paddingBottom = 12;
    }

    return (
      <View onLayout={event => this.measureView(event)} style={[styles.container, { marginTop, paddingBottom }]}>
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
