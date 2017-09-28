<<<<<<< HEAD
import React, { PureComponent } from 'react'
import { View, Text, TextInput, StyleSheet, Keyboard, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { setupDelegate } from 'swipes-core-js/classes/utils';
=======
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { View, Text, TextInput, StyleSheet, Keyboard, Platform, TouchableOpacity } from 'react-native';
import { setupDelegate, bindAll } from 'swipes-core-js/classes/utils';
>>>>>>> 393dc5750... refactored attachments and made the post att work like comments
import { fromJS } from 'immutable';
import { colors, viewSize } from 'globalStyles';
import * as gs from 'styles';
import * as a from 'actions';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import ExpandingTextInput from 'components/expanding-text-input/ExpandingTextInput';
import AttachButton from 'components/attach-button/AttachButton';

const styles = StyleSheet.create({
  container: {
    ...gs.mixins.border(1, gs.colors.deepBlue20, 'top'),
    ...gs.mixins.flex('row'),
    width: viewSize.width,
    minHeight: 54,
  },
  backButton: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    minWidth: 54,
    maxWidth: 54,
  },
  inputWrapper: {
    ...gs.mixins.size(1),
    ...Platform.select({
      ios: {
        ...gs.mixins.padding(6, 0),
      },
      android: {
        ...gs.mixins.padding(6, 0, 6, 12),
      },
    }),
    minHeight: 54,
  },
  inputBorder: {
    ...gs.mixins.border(1, gs.colors.deepBlue10),
    ...gs.mixins.flex('row', 'left', 'center'),
    ...gs.mixins.padding(12, 0, 12, 18),
    alignSelf: 'stretch', 
    minHeight: 54 - (6 * 2),
    borderRadius: 25,
  },
  input: {
    ...gs.mixins.size(1),
    ...gs.mixins.font(13, gs.colors.deepBlue80, 18),
    alignSelf: 'stretch',
  },
  actions: {
    ...gs.mixins.size(1),
    maxWidth: 54,
  },
  iconButton: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    minWidth: 54,
    maxWidth: 54,
    minHeight: 54,
  }
});

class HOCPostFooter extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
      attachments: fromJS([]),
      isLoadingComment: false,
    }
    setupDelegate(this, 'onAddComment', 'onNavigateBack', 'onAutoFocus');
    bindAll(this, ['handleAddComment', 'handleAttach']);
  }

  onAddAttachment() {
    const { navPush, uploadAttachment } = this.props;
    const { attachments } = this.state;

    this.onAutoFocus();
    if(!attachments.size) {
      return uploadAttachment(this.handleAttach);
    }
    
    Keyboard.dismiss();

    navPush({
      id: 'AttachmentView',
      title: 'Attachment',
      props: {
        delegate: this,
        initialAttachments: attachments
      },
    })
  }
  handleAttach(att) {
    const { attachments } = this.state;

    this.setState({
      attachments: attachments.push(att)
    })
  }
  handleAddComment() {
    const { text, attachments } = this.state;

    this.onAddComment(text, attachments);
    this.setState({ text: '', attachments: fromJS([]) });
    Keyboard.dismiss();
  }
  renderBackButton() {
    const { text } = this.state;

    if (Platform.OS === 'android') {
      return undefined;
    }

    return (
      <RippleButton onPress={this.onNavigateBack}>
        <View style={styles.backButton}>
          <Icon name="ArrowLeftLine" width="24" height="24" fill={colors.deepBlue80} />
        </View>
      </RippleButton>
    )
  }
  renderSendButton() {
    const { isLoading } = this.props;
  
    if (isLoading('commenting')) {

      return (
        <View style={styles.iconButton}>
          <ActivityIndicator color={colors.blue100} />
        </View>
      )
    }

    return (
      <RippleButton style={styles.iconButton} rippleColor={colors.blue100} rippleOpacity={0.2} onPress={this.handleAddComment}>
        <View style={styles.iconButton}>
          <Icon name="Send" width="24" height="24" fill={gs.colors.blue100} />
        </View>
      </RippleButton>
    )
  }


  render() {
    const { placeholder } = this.props;
    const { attachments } = this.state;

    return (
      <View style={styles.container}>
        {this.renderBackButton()}
        <View style={styles.inputWrapper}>
          <View style={styles.inputBorder}>
            <ExpandingTextInput
              ref="input"
              onChangeText={(text) => this.setState({ text })}
              style={styles.input}
              underlineColorAndroid="transparent"
              autoCapitalize="sentences"
              autoCorrect={true}
              placeholder={placeholder}
              minRows={1}
              maxRows={4}
              value={this.state.text}
            />
            <AttachButton 
              numberOfAttachments={attachments.size} 
              delegate={this} 
            />
          </View>
        </View>
        <View style={styles.actions}>
          {this.renderSendButton()}
        </View>
      </View>
    )
  }
}
const mapStateToProps = (state) => ({
});

export default connect(mapStateToProps, {
  uploadAttachment: a.attachments.upload,
})(HOCPostFooter);

