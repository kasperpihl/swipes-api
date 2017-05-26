import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableWithoutFeedback, ActivityIndicator, Keyboard, Platform } from 'react-native';
import HOCHeader from '../../components/header/HOCHeader';
import { attachmentIconForService, setupDelegate } from '../../../swipes-core-js/classes/utils';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import RippleButton from '../../components/ripple-button/RippleButton';
import Icon from '../../components/icons/Icon';
import { colors } from '../../utils/globalStyles';

class Notify extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { text: '', hasLoaded: false };

    setupDelegate(this);
    this.callDelegate.bindAll('onOpenAttachment', 'onFlagAttachment', 'onChangeText');
  }
  componentDidMount() {
    this.loadingTimeout = setTimeout(() => {
      this.setState({ hasLoaded: true });
    }, 1);
  }
  componentWillUnmount() {
    clearTimeout(this.loadingTimeout);
  }
  renderHeader() {
    const { notify } = this.props;
    const assignees = notify.get('assignees');
    const title = msgGen.notify.getNotifyTitle(notify);

    return (
      <HOCHeader title={title}>
        {assignees.length ? (
          <HOCAssigning assignees={assignees} />
        ) : (
            undefined
          )}
      </HOCHeader>
    );
  }
  renderWriteHandoff() {
    const { me, notify } = this.props;
    const assignees = [`${me.get('id')}`];
    const placeholder = msgGen.notify.getWriteMessagePlaceholder(notify);

    return (
      <View style={styles.handoff}>
        <View style={styles.profileImage}>
          <HOCAssigning assignees={[`${me.get('id')}`]} />
        </View>
        <View style={styles.handoffInput}>
          <TextInput
            numberOfLines={3}
            multiline
            autoFocus
            placeholder={placeholder}
            autoCapitalize="sentences"
            onChange={this.onChangeText}
            initialValue={this.props.notify.get('message')}
            placeholderTextColor={colors.deepBlue50}
            style={styles.input}
            underlineColorAndroid="rgba(255,255,255,0)"
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
    const { hasLoaded } = this.state;

    if (!hasLoaded) {
      return this.renderListLoader();
    }

    return (
      <View style={styles.container}>
        {this.renderHeader()}
        <ScrollView>
          {this.renderWriteHandoff()}
          {this.renderAttachmentList()}
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
  handoff: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingTop: 30,
    paddingBottom: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.deepBlue20,
  },
  profileImage: {
    width: 32,
  },
  handoffInput: {
    flex: 1,
  },
  input: {
    padding: 0,
    margin: 0,
    marginLeft: 30,
    paddingRight: 9,
    paddingLeft: 3,
    paddingBottom: 15,
    marginTop: 3,
    fontSize: 15,
    lineHeight: 25,
    textAlignVertical: 'top',
    ...Platform.select({
      ios: {
        height: 25 * 3,
      },
    }),
  },
  attachment: {
    flex: 1,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  attachmentLeft: {
    flex: 1,
    minHeight: 72,
    alignItems: 'center',
    flexDirection: 'row',
  },
  flagButton: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 72 / 2,
    overflow: 'hidden',
  },
  icon: {
    paddingRight: 18,
  },
  label: {
    flex: 1,
    color: colors.deepBlue100,
    fontSize: 18,
  },
  flagIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.deepBlue5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Notify;
