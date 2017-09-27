import React, { PureComponent} from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableWithoutFeedback, Platform, UIManager, LayoutAnimation, Keyboard } from 'react-native';
import { setupDelegate } from 'react-delegate';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import * as a from 'actions';
import * as cs from 'swipes-core-js/selectors';
import Icon from 'Icon';
import RippleButton from 'RippleButton';
import HOCAssigning from 'components/assignees/HOCAssigning';
import { colors, viewSize } from 'globalStyles';

const styles = StyleSheet.create({
  createActionWrapper: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressableOverlay: {
    position: 'absolute',
    left: 0, top: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,12,47, .5)'
  },
  modalWrapper: {
    backgroundColor: 'white',
    elevation: 4,
    borderRadius: 6,
    overflow: 'hidden', 
  },
  inputWrapper: {
    alignSelf: 'stretch',
    flex: 1,
    maxHeight: 45,
    alignItems: 'center',
    borderRadius: 6,
  },
  input: {
    alignSelf: 'stretch',
    flex: 1,
    fontSize: 15,
    color: colors.deepBlue100,
    paddingHorizontal: 15,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  contentWrapper: {
    flex: 1,
  },
  assigneeWrapper: {
    alignSelf: 'stretch',
    flex: 1,
    maxHeight: 60,
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: colors.deepBlue10,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
  },
  assigneeTextWrapper: {
    flex: 1,
  },
  assigneeText: {
    fontSize: 15,
    lineHeight: 18,
    color: colors.deepBlue80
  },
  actionWrapper: {
    alignSelf: 'stretch',
    flex: 1,
    maxHeight: 70,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 21,
  }
});

class CreateNewItemModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      assignees: fromJS(props.defAssignees || []),
      milestoneId: props.milestoneId || null,
      keyboardOpen: false,
    };

    this.handleAssigning = this.handleAssigning.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    this.onCloseModal = this.onCloseModal.bind(this);
    setupDelegate(this, 'handleModalState', 'onModalCreateAction');

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate(nextProps) {
    LayoutAnimation.easeInEaseOut();
  }
  componentWillUnmount() {
    clearTimeout(this.showAssigneeModalTimeout);
    clearTimeout(this.showNewItemModalTimeout);
  }
  onActionClick() {
    const { title, assignees, milestoneId } = this.state;
    const { navPop } = this.props;

    if (title.length) {
      this.refs.textInput.blur();
      Keyboard.dismiss;
      this.onModalCreateAction(title, assignees, milestoneId);
      
      setTimeout(() => {
        navPop();
      }, 1)
    }
  }
  onCloseModal() {
    const { navPop } = this.props;

    this.refs.textInput.blur();
    Keyboard.dismiss;

    setTimeout(() => {
      navPop()
    }, 1)
  }
  handleAssigning() {
    const { assignModal } = this.props;
    const { assignees } = this.state;
    assignModal({
      selectedIds: assignees,
      onActionPress: (selectedIds) => this.setState({assignees: selectedIds}),
    })
  }
  isActive() {
    const { title } = this.state;

    return title.length > 0;
  }
  renderInput() {
    const { placeholder } = this.props;
    let inputBg = this.isActive() ? colors.blue5 : 'white';

    return (
      <View style={[styles.inputWrapper, { backgroundColor: inputBg }]}>
        <TextInput
          ref="textInput"
          style={styles.input}
          onChangeText={(text) => this.setState({title: text})}
          underlineColorAndroid="transparent"
          value={this.state.title}
          placeholder={placeholder}
          autoFocus={true}
          onSubmitEditing={this.onActionClick}
          returnKeyType="send"
        />
      </View>
    )
  }
  renderAssignees() {
    const { assignees } = this.state;
    const { defAssignees } = this.props;

    if (!defAssignees) {
      return undefined;
    }

    return (
      <RippleButton style={styles.assigneeWrapper} onPress={this.handleAssigning}>
        <View style={styles.assigneeWrapper}>
          <View style={styles.assigneeTextWrapper}>
            <Text selectable={true} style={styles.assigneeText}>Assignees:</Text>
          </View>
          <HOCAssigning assignees={assignees} />
        </View>
      </RippleButton>
    )
  }
  renderActions() {
    const { title, assignees, milestoneId } = this.state;
    const { actionLabel } = this.props;

    return (
      <View style={styles.actionWrapper}>
        <RippleButton rippleColor={'#FFFFFF'} rippleOpacity={.5} style={styles.actionButton} onPress={this.onCloseModal}>
          <View style={[styles.actionButton, {backgroundColor: colors.deepBlue40}]}>
            <Text selectable={true} style={[styles.actionButtonLabel, { color: colors.deepBlue100 }]}>Cancel</Text>
          </View>
        </RippleButton>
        <RippleButton  rippleColor={'#FFFFFF'} rippleOpacity={.5} style={styles.actionButton} onPress={this.onActionClick}>
          <View style={[styles.actionButton, {backgroundColor: colors.blue100}]}>
            <Text selectable={true} style={[styles.actionButtonLabel, { color: 'white' }]}>{actionLabel}</Text>
          </View>
        </RippleButton>
      </View>
    )
  }
  renderContent() {

    if (this.isActive()) {
      return (
        <View style={styles.contentWrapper}>
          {this.renderAssignees()}
          {this.renderActions()}
        </View>
      )
    }

    return undefined;
  }

  render() {
    const { modalState, defAssignees } = this.props;
    const { text } = this.state;

    let modalSize = {
      width: viewSize.width / 1.5,
      height: 45,
    }

    if (this.isActive()) {
      modalSize = {
        width: viewSize.width * .95,
        height: defAssignees ? 175 : 115,
      }
    }

    return (
      <View style={{ flex: 1, backgroundColor: colors.deepBlue100  }}>
        <View style={styles.createActionWrapper}>
          <View style={[styles.modalWrapper, modalSize]}>
            {this.renderInput()}
            {this.renderContent()}
          </View>
        </View>
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, {
  assignModal: a.modals.assign,
})(CreateNewItemModal);
