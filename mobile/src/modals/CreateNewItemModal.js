import React, { PureComponent} from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableWithoutFeedback, Platform, UIManager, LayoutAnimation } from 'react-native';
import { setupDelegate } from 'react-delegate';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';
import * as a from '../actions';
import * as ca from '../../swipes-core-js/actions';
import Icon from '../components/icons/Icon';
import RippleButton from '../components/ripple-button/RippleButton';
import HOCAssigning from '../components/assignees/HOCAssigning';
import { colors, viewSize } from '../utils/globalStyles';

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
  },
  inputWrapper: {
    alignSelf: 'stretch', 
    flex: 1,
    maxHeight: 45,
    borderBottomColor: colors.blue100,
    borderBottomWidth: 1,
    alignItems: 'center',
    borderRadius: 6,
  },
  input: {
    alignSelf: 'stretch', 
    flex: 1,
    fontSize: 15,
    lineHeight: 18,
    color: colors.deepBlue100,
    paddingHorizontal: 15,
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
    };
    
    this.handleAssigning = this.handleAssigning.bind(this);
    this.onActionClick = this.onActionClick.bind(this);
    setupDelegate(this, 'handleModalState', 'onModalCreateAction');

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }
  componentWillUpdate() {
    LayoutAnimation.easeInEaseOut();
  }
  onActionClick() {
    const { title, assignees, milestoneId } = this.state;

    this.onModalCreateAction(title, assignees, milestoneId)
  }
  onModalAssign(sortedUsers, data) {
    let { assignees } = this.state;
    const { showModal } = this.props;
    assignees = List(data.map(i => sortedUsers.getIn([i, 'id'])));

    this.setState({assignees: assignees})

    showModal();
    this.handleModalState();
  }
  handleAssigning() {
    const { users, showModal } = this.props;
    let { assignees } = this.state;

    const sortedUsers = users.sort(
      (b, c) => msgGen.users.getFirstName(b).localeCompare(msgGen.users.getFirstName(c)),
    ).toList();

    const userInfoToActions = sortedUsers.map((u, i) => {
      const selected = this.state.assignees.indexOf(u.get('id')) > -1;

      const obj = {
        title: `${msgGen.users.getFirstName(u.get('id'))} ${msgGen.users.getLastName(u.get('id'))}`,
        selected,
        index: i,
        leftIcon: {
          user: u.get('id'),
        },
      };

      return fromJS(obj);
    });

    const modal = {
      title: 'Assign teammeates',
      onClick: this.onModalAssign.bind(this, sortedUsers),
      multiple: 'Assign',
      items: userInfoToActions,
      fullscreen: true,
    };

    this.handleModalState();
    showModal(modal);
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
          style={styles.input}
          onChangeText={(text) => this.setState({title: text})}
          underlineColorAndroid="transparent"
          value={this.state.title}
          placeholder={placeholder}
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
            <Text style={styles.assigneeText}>Assignees:</Text>  
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
        <RippleButton rippleColor={'#FFFFFF'} rippleOpacity={.5} style={styles.actionButton} onPress={this.handleModalState}>
          <View style={[styles.actionButton, {backgroundColor: colors.deepBlue40}]}>
            <Text style={[styles.actionButtonLabel, { color: colors.deepBlue100 }]}>Cancel</Text>
          </View>
        </RippleButton>
        <RippleButton  rippleColor={'#FFFFFF'} rippleOpacity={.5} style={styles.actionButton} onPress={this.onActionClick}>
          <View style={[styles.actionButton, {backgroundColor: colors.blue100}]}>
            <Text style={[styles.actionButtonLabel, { color: 'white' }]}>{actionLabel}</Text>
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
      width: viewSize.width / 2,
      height: 45,
    }

    if (this.isActive()) {
      modalSize = {
        width: viewSize.width / 1.5,
        height: defAssignees ? 175 : 115,
      }
    }

    return (
      <Modal
        animationType={"fade"}
        transparent={true}
        visible={modalState}
        onRequestClose={this.handleModalState}
      >
        <View style={styles.createActionWrapper}>
          <TouchableWithoutFeedback onPress={this.handleModalState}>
            <View style={styles.pressableOverlay} />
          </TouchableWithoutFeedback>
          <View style={[styles.modalWrapper, modalSize]}>
            {this.renderInput()}
            {this.renderContent()}
          </View>
        </View>
      </Modal>
    )
  }
}

function mapStateToProps(state) {
  return {
    users: state.get('users'),
  };
}

export default connect(mapStateToProps, {
  showModal: a.modals.show,
})(CreateNewItemModal);