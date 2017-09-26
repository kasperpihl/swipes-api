import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, UIManager, LayoutAnimation } from 'react-native';
import { setupDelegate } from 'react-delegate';
import { colors, viewSize } from 'globalStyles';
import { setupCachedCallback } from 'swipes-core-js/classes/utils';
import Icon from 'Icon';
import RippleButton from 'RippleButton';

const styles = StyleSheet.create({
  container: {
    width: viewSize.width,
    height: Platform.OS === 'ios' ? viewSize.height - 54 + 20 : viewSize.height - 54 + 24,
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(0, 12, 47, 0.96)',
    flexDirection: 'column',
    paddingTop: Platform.OS === 'ios' ? 20 : 24,
  },
  aboutWrapper: {
    marginHorizontal: 15,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue80,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutTitle: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    color: 'white',
    paddingLeft: 6,
  },
  aboutTextWrapper: {
    paddingTop: 6,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.deepBlue60,
  },
  infoWrapper: {
    marginHorizontal: 15,
    paddingTop: 18,
    paddingBottom: 6,
  },
  infoRow: {
    paddingBottom: 12,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    lineHeight: 18,
    color: 'white',
  },
  infoContent: {
    paddingTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.deepBlue60,
  },
  actionContainer: {
    minHeight: 140,
    justifyContent: 'center',
  },
  actionScroll: {
    paddingHorizontal: 15,
  },
  actionWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
    marginTop: Platform.OS === 'ios' ? -15 : 0,
  },
  actionButton: {
    width: 66,
    height: 66,
    borderRadius: 66 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    paddingTop: 6,
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    lineHeight: 18,
  },
});

class InfoTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};

    this.onActionCached = setupCachedCallback(this.onAction, this);

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    // LayoutAnimation.configureNext(// LayoutAnimation.create(250, // LayoutAnimation.Types.easeOut, // LayoutAnimation.Properties.opacity));
  }
  componentWillReceiveProps(nextProps) {
    const { infoTab } = this.props;

    if (infoTab.size && !nextProps.infoTab.size) {
      infoTab.get('onClose')();
    }
  }
  onAction(index) {
    const { infoTab } = this.props;

    infoTab.get('onPress')(index);
  }
  renderAbout() {
    const { infoTab } = this.props;
    const about = infoTab.get('about');

    if (!about) {
      return undefined;
    }

    return (
      <View style={styles.aboutWrapper}>
        <View style={styles.aboutHeader}>
          <Icon name="QuestionMono" width="24" height="24" fill="white" />
          <Text selectable={true} style={styles.aboutTitle}>{about.title}</Text>
        </View>
        <View style={styles.aboutTextWrapper}>
          <Text selectable={true} style={styles.aboutText}>{about.text}</Text>
        </View>
      </View>
    );
  }
  renderInfo() {
    const { infoTab } = this.props;
    const info = infoTab.get('info');

    if (!info) {
      return undefined;
    }

    const renderInfo = info.map((inf, i) => (
      <View style={styles.infoRow} key={inf.title}>
        <Text selectable={true} style={styles.infoTitle}>{inf.title.toUpperCase()}</Text>
        <View style={styles.infoContent}>
          {inf.icon ? (
            <Icon name={inf.icon} width="18" height="18" fill={colors.deepBlue50} style={{ marginRight: 6 }} />
          ) : (
            undefined
          )}
          <Text selectable={true} style={styles.infoText}>{inf.text}</Text>
        </View>
      </View>
    ));

    return (
      <View style={styles.infoWrapper}>
        {renderInfo}
      </View>
    );
  }
  renderActions() {
    const { infoTab } = this.props;
    const actions = infoTab.get('actions');

    if (!actions) {
      return undefined;
    }

    const renderActions = actions.map((a, i) => {
      let actionColor = colors.blue100;

      if (a.danger) {
        actionColor = colors.red80;
      }

      if (a.complete) {
        actionColor = colors.greenColor;
      }

      return (
        <RippleButton onPress={this.onActionCached(i)} key={a.icon}>
          <View style={styles.actionWrapper}>
            <View style={[styles.actionButton, { backgroundColor: actionColor }]}>
              <Icon name={a.icon} width="24" height="24" fill="white" />
            </View>
            <Text selectable={true} style={styles.actionLabel}>{a.title}</Text>
          </View>
        </RippleButton>
      );
    });

    return (
      <View style={styles.actionContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.actionScroll} contentContainerStyle={{ alignItems: 'center', height: 140 }}>
          {renderActions}
        </ScrollView>
      </View>
    );
  }
  render() {
    const { infoTab } = this.props;
    let topPosition = viewSize.height + 30;

    if (infoTab.size) {
      topPosition = 0;
    }

    return (
      <View style={[styles.container, { top: topPosition }]} >
        <ScrollView style={{ height: viewSize.height - 55 - 140, borderBottomWidth: 1, borderBottomColor: colors.deepBlue80 }}>
          {this.renderAbout()}
          {this.renderInfo()}
        </ScrollView>
        {this.renderActions()}
      </View>
    );
  }
}

export default InfoTab;

InfoTab.propTypes = {};
