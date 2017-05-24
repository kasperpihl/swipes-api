import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import HOCHeader from '../../components/header/HOCHeader';
import { attachmentIconForService, setupCachedCallback } from '../../../swipes-core-js/classes/utils';
import HOCAssigning from '../../components/assignees/HOCAssigning';
import RippleButton from '../../components/ripple-button/RippleButton';
import Icon from '../../components/icons/Icon';
import { colors } from '../../utils/globalStyles';

class Notify extends Component {
  constructor(props) {
    super(props);
    this.state = { text: '' };

    this.flagPress = setupCachedCallback(this.flagPress, this);
  }
  attachmentPress(att) {
    console.log('att', att)
  }
  renderHeader() {
    return <HOCHeader title="Ask for something" />;
  }
  renderWriteHandoff() {
    const { me } = this.props;
    const assignees = [`${me.get('id')}`];

    return (
      <View style={styles.handoff}>
        <View style={styles.profileImage}>
          <HOCAssigning assignees={[`${me.get('id')}`]} />
        </View>
        <View style={styles.handoffInput}>
          <TextInput
            numberOfLines={8}
            multiline
            autoFocus
            placeholder=""
            onChange={(event) => {
              this.setState({
                text: event.nativeEvent.text,
              });
            }}
            value={this.state.text}
            placeholderTextColor={colors.deepBlue50}
            style={styles.input}
            underlineColorAndroid="rgba(255,255,255,0)"
          />
        </View>
      </View>
    );
  }
  renderAttachmentList() {
    const { goal } = this.props;
    const attachmentOrder = goal.get('attachment_order');
    const attachments = goal.get('attachments');

    const attachmentsUi = attachmentOrder.map((att, i) => {
      const at = attachments.get(att);
      const icon = attachmentIconForService(at.getIn(['link', 'service']) || at);

      return (
        <RippleButton rippleColor={colors.deepBlue60} style={styles.attachment} rippleOpacity={0.8} key={att} onPress={this.attachmentPress(at)}>
          <View style={styles.attachment}>
            <View style={styles.icon}>
              <Icon name={icon} width="24" height="24" fill={colors.deepBlue100} />
            </View>
            <Text style={styles.label} ellipsizeMode="tail">{at.get('title')}</Text>
            <View style={styles.flagIcon}>
              <Icon name="Flag" width="24" height="24" fill={colors.deepBlue60} />
            </View>
          </View>
        </RippleButton>
      );
    });

    return attachmentsUi;
  }
  render() {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          {this.renderHeader()}
          <ScrollView>
            {this.renderWriteHandoff()}
            {this.renderAttachmentList()}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgColor,
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
  },
  attachment: {
    flex: 1,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
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