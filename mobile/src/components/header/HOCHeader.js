import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, UIManager, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { setupDelegate } from 'swipes-core-js/classes/utils';
import Tabs from 'components/tabs/Tabs';
import Icon from 'Icon';
import { colors, viewSize } from 'globalStyles';

const styles = StyleSheet.create({
  container: {
    width: viewSize.width - 30,
    marginHorizontal: 15,
    paddingTop: 33,
    flexDirection: 'column',
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue100,
    backgroundColor: colors.bgColor,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomContainer: {
    flexDirection: 'row',
  },
  titles: {
    flexDirection: 'column',
  },
  title: {
    flex: 1,
    color: colors.deepBlue100,
    fontWeight: 'bold',
    fontSize: 21,
    lineHeight: 36,
  },
  subtitle: {
    flex: 1,
    fontSize: 12,
    lineHeight: 15,
    color: colors.deepBlue40,
    paddingTop: 6,
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

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    setupDelegate(this, 'onChangeTab', 'onHeaderTap');
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
  componentWillUpdate() {
    // LayoutAnimation.easeInEaseOut();
  }
  onSelect(el) {
    this.onChangeTab(el.props.name);
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
  renderSubtitle() {
    const { subtitle } = this.props;
    if (!subtitle) {
      return undefined;
    }

    if (typeof subtitle === 'string') {
      return (
        <View style={{ alignSelf: 'stretch', height: 21 }} >
          <Text selectable={true} style={styles.subtitle}>{subtitle}</Text>
        </View>
      )
    } else {
      return subtitle;
    }
  }
  renderTabs() {
    const { tabs } = this.props;

    if (!tabs) {
      return undefined;
    }

    const renderTabs = tabs.map((t, i) => (
      <Text selectable={true} name={i} key={i} style={styles.tabTitle}>{t}</Text>
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
  renderHeaderAction() {
    const { headerAction } = this.props;

    return headerAction;
  }
  renderHeaderIcon() {
    const { icon } = this.props;

    if (!icon) {
      return undefined;
    }

    return (
      <View style={{
        width: 36,
        height: 36,
        backgroundColor: colors.deepBlue10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 9,
        marginTop: 6,
        borderRadius: 2,
        flex: 0,
      }} >
        <Icon name={icon} width="24" height="24" fill={colors.deepBlue80} />
      </View>
    )
  }
  renderTitle() {

    return (
      <Text style={styles.title}>{this.props.title}</Text>
    )
  }
  render() {
    const { headerHeight } = this.state;
    const { tabs, children, collapsed } = this.props;

    let marginTop = 0;
    let paddingBottom = 0;
    let opacity = 1;
    let borderBottomWidth = 1;

    if (collapsed) {
      marginTop = -headerHeight;

      if (Platform.OS === 'ios') {
        marginTop = -headerHeight + 20;
        opacity = 0;
        borderBottomWidth = 0;
      }
    }

    if (!tabs) {
      paddingBottom = 12;
    }

    return (
      <View onLayout={event => this.measureView(event)} style={[styles.container, { marginTop, paddingBottom, borderBottomWidth }]}>
        <View style={{ flexDirection: 'row', alignSelf: 'stretch' }}>
          <TouchableWithoutFeedback style={{ flex: 1 }} onPress={this.onHeaderTap}>
            <View style={{ flexDirection: 'column', flex: 1 }}>
              <View style={[styles.topContainer, { opacity }]}>
                {this.renderHeaderIcon()}
                {this.renderHeaderAction()}
                {this.renderTitle()}
              </View>
              {this.renderSubtitle()}
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.children}>
            {children}
          </View>
        </View>
        <ScrollView style={[styles.bottomContainer, { opacity }]} horizontal showsHorizontalScrollIndicator={false} alwaysBounceHorizontal={false} >
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
