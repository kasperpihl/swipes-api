import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
// import { setupDelegate } from 'react-delegate';
import { colors, viewSize } from '../../utils/globalStyles';
import Icon from '../../components/icons/Icon';

const styles = StyleSheet.create({
	container: {
    width: viewSize.width,
    height: (Platform.OS === 'ios') ? viewSize.height - 55 - 20 : viewSize.height - 55,
    position: 'absolute',
    left: 0, top: (Platform.OS === 'ios') ? 20 : 24,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: 'rgba(0, 12, 47, 0.96)',
    borderBottomWidth: 1,
    borderBottomColor: 'red',
    flexDirection: 'column',
  },
  aboutWrapper: {
    marginHorizontal: 15,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue80,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center'
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
    alignItems: 'center'
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.deepBlue60,
  },
  actionContainer: {
    minHeight: 140,
  },
  actionScroll: {
    paddingHorizontal: 15,
  },
  actionWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 24,
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
  }
})

class InfoTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    // setupDelegate(this);
    // this.callDelegate.bindAll('onLala');
  }
  componentDidMount() {
  }
  renderAbout() {
    const { infoTab: iT } = this.props;
    const { about } = iT;

    return (
      <View style={styles.aboutWrapper}>
        <View style={styles.aboutHeader}>
          <Icon name="QuestionMono" width="24" height="24" fill="white"/>
          <Text style={styles.aboutTitle}>{about.title}</Text>
        </View>
        <View style={styles.aboutTextWrapper}>
          <Text style={styles.aboutText}>{about.text}</Text>
        </View>
      </View>
    )
  }
  renderInfo() {
    const { infoTab: iT } = this.props;
    const { info } = iT;

    const renderInfo = info.map((inf, i) => {
      return (
        <View style={styles.infoRow} key={inf.title}>
          <Text style={styles.infoTitle}>{inf.title.toUpperCase()}</Text>
          <View style={styles.infoContent}>
            {inf.icon ? (
              <Icon name={inf.icon} width="18" height="18" fill={colors.deepBlue50} style={{ marginRight: 6 }}/>
            ) : (
              undefined
            )}
            <Text style={styles.infoText}>{inf.text}</Text>
          </View>
        </View>
      )
    })

    return (
      <View style={styles.infoWrapper}>
        {renderInfo}
      </View>
    )

  }
  renderActions() {
    const { infoTab: iT } = this.props;
    const { actions } = iT;

    const renderActions = actions.map((a, i) => {
      const actionColor = a.danger ? colors.red80 : colors.blue100;

      return (
        <View style={styles.actionWrapper} key={a.icon}>
          <View style={[styles.actionButton, { backgroundColor: actionColor }]}>
            <Icon name={a.icon} width="24" height="24" fill="white" />
          </View>
          <Text style={styles.actionLabel}>{a.title}</Text>
        </View>
      )
    })

    return (
      <View style={styles.actionContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={styles.actionScroll}>
          {renderActions}
        </ScrollView>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container} >
        <ScrollView style={{height: viewSize.height - 55 - 140, borderBottomWidth: 1, borderBottomColor: colors.deepBlue80, }}>
        	{this.renderAbout()}
          {this.renderInfo()}
        </ScrollView>
        {this.renderActions()}
      </View>
    );
  }
}

export default InfoTab

InfoTab.propTypes = {};
