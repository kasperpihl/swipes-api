import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableWithoutFeedback, ActivityIndicator, Keyboard, Platform } from 'react-native';
import HOCHeader from '../../components/header/HOCHeader';
import { attachmentIconForService, setupDelegate } from '../../../swipes-core-js/classes/utils';
import GoalsUtil from '../../../swipes-core-js/classes/goals-util';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import NotificationItem from '../dashboard/NotificationItem';
import RippleButton from '../../components/ripple-button/RippleButton';
import Icon from '../../components/icons/Icon';
import { colors, viewSize } from '../../utils/globalStyles';
import HandoffMessage from './HandoffMessage';

class Notify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { text: '' };

    setupDelegate(this, 'onOpenAttachment', 'onFlagAttachment', 'onChangeText', 'onAssignUsers');
  }
  getHelper() {
    const { goal, me } = this.props;
    return new GoalsUtil(goal, me.get('id'));
  }
  renderHeader() {
    const { notify } = this.props;
    const assignees = notify.get('assignees');
    const helper = this.getHelper();
    const amountOfAssignees = assignees.size;

    const renderAssigneesText = assignees.map((a, i) => {
      if (amountOfAssignees - 1 === i) {
        return <Text style={styles.assignee} key={a}>{msgGen.users.getFullName(a)}</Text>
      } else {
        return <Text style={styles.assignee} key={a}>{msgGen.users.getFullName(a)}, </Text>
      }
    })

    return (
      <View style={styles.headerWrapper} >
        <Text style={styles.headerLabel}>To:</Text>
        <View style={styles.assigneesWrapper}>
          {renderAssigneesText}
        </View>
        <RippleButton style={styles.headerButtonWrapper} onPress={this.onAssignUsersCached()}>
          <View style={styles.headerButton}>
            <Icon name="Plus" width="24" height="24" fill={colors.bgColor} />
          </View>
        </RippleButton>
      </View>
    )
  }
  renderWriteHandoff() {
    const { me, notify, delegate } = this.props;
    const assignees = [`${me.get('id')}`];
    const placeholder = msgGen.notify.getWriteMessagePlaceholder(notify);

    return (
      <View style={styles.handoff}>
        <View style={styles.profileImage}>
          <HOCAssigning assignees={[`${me.get('id')}`]} />
        </View>
        <View style={styles.handoffInput}>
          <HandoffMessage
            delegate={delegate}
            placeholder={placeholder}
            initialText={notify.get('message')}
          />
        </View>
      </View>
    );
  }
  renderAttachmentList() {
    const { goal, notify } = this.props;
    const attachmentOrder = goal.get('attachment_order');
    const attachments = goal.get('attachments');

    const attachmentsUi = attachmentOrder.map((att, i) => {
      const at = attachments.get(att);
      const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);
      const isFlagged = notify.get('flags').contains(at.get('id'));

      const flaggedIconColor = isFlagged ? colors.red80 : colors.deepBlue60;

      return (
        <View style={styles.attachment} key={att}>
          <RippleButton rippleColor={colors.deepBlue60} style={styles.attachment} rippleOpacity={0.8} onPress={this.onOpenAttachmentCached(at)}>
            <View style={styles.attachmentLeft}>
              <View style={styles.icon}>
                <Icon name={icon} width="24" height="24" fill={colors.deepBlue100} />
              </View>
              <Text style={styles.label} ellipsizeMode="tail">{at.get('title')}</Text>
            </View>
          </RippleButton>
          <RippleButton rippleColor={colors.red100} style={styles.flagButton} rippleOpacity={0.8} onPress={this.onFlagAttachmentCached(at.get('id'))}>
            <View style={styles.flagIcon}>
              <Icon name="Flag" width="24" height="24" fill={flaggedIconColor} />
            </View>
          </RippleButton>
        </View>
      );
    });

    return attachmentsUi;
  }
  renderListLoader() {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large" style={styles.loader} />
      </View>
    );
  }
  renderContent() {
    const { hasLoaded } = this.props;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <ScrollView>
          {this.renderWriteHandoff()}
          {/*{this.renderAttachmentList()}*/}
        </ScrollView>
      </View>
    );
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {this.renderContent()}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerWrapper: {
    width: viewSize.width - 30,
    marginTop: 33,
    marginLeft: 15,
    flexDirection: 'row',
    paddingBottom: 6,
    borderBottomColor: colors.deepBlue30,
    borderBottomWidth: 1,
  },
  headerLabel: {
    fontSize: 12,
    lineHeight: 24,
    fontWeight: '500',
    color: colors.deepBlue50,
  },
  assigneesWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 6,
    paddingTop: 2,
  },
  assignee: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '500',
    color: colors.blue100,
  },
  headerButtonWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButton: {
    width: 24,
    height: 24,
    backgroundColor: colors.blue100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  handoff: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingTop: 15,
  },
  profileImage: {
    width: 30,
  },
  handoffInput: {
    flex: 1,
  },
});

export default Notify;
