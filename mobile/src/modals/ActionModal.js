import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, Text, View, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { fromJS } from 'immutable';
import * as a from '../actions';
import { setupCachedCallback } from '../../swipes-core-js/classes/utils';
import { colors, viewSize } from '../utils/globalStyles';
import RippleButton from '../components/ripple-button/RippleButton';
import HOCAssigning from '../components/assignees/HOCAssigning';
import Icon from '../components/icons/Icon';

class ActionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: false,
      assignees: fromJS({
        selectedAssignees: [],
      }),
    };

    this.closeModal = this.closeModal.bind(this);
    this.onCTAClick = this.onCTAClick.bind(this);
    this.onButtonClick = setupCachedCallback(this.onButtonClick, this);
  }
  componentWillReceiveProps(nextProps) {
    const { modalState } = this.state;

    if (nextProps.modal.size > 1 && !modalState) {
      this.setState({ modalState: true });
    } else if (nextProps.modal.size < 1 && modalState) {
      this.setState({ modalState: false });
    }
  }
  onButtonClick(i, props, e) {
    let { assignees } = this.state;
    const uId = props.user.get('id');

    if (assignees.get('selectedAssignees').includes(uId)) {
      assignees = assignees.updateIn(['selectedAssignees'], fl => fl.filter(f => f !== uId));
    } else {
      assignees = assignees.updateIn(['selectedAssignees'], fl => fl.push(uId));
    }

    this.updateState(assignees);
  }
  onCTAClick() {
    const { modal } = this.props;

    modal.get('onClick')(this.state.assignees.get('selectedAssignees'));
  }
  closeModal() {
    const { showModal } = this.props;

    showModal();
  }
  updateState(assignees) {
    this.setState({ assignees });
  }
  renderTitle() {
    const { modal } = this.props;

    if (modal && modal.get('title')) {
      return (
        <View style={styles.titleWrapper}>
          <Text style={styles.title}>
            {modal.get('title')}
          </Text>
        </View>
      );
    }

    return undefined;
  }
  renderSelection(selected) {
    const selectedBorderColor = selected ? 'rgba(255,155,255,0)' : colors.deepBlue20;

    return (
      <View style={[styles.selectionWrapper, { borderColor: selectedBorderColor }]}>
        {selected ? (
          <Icon name="ChecklistCheckmark" width="24" height="24" fill={colors.greenColor} />
        ) : (
            undefined
          )}
      </View>
    );
  }
  renderCTA() {
    return (
      <RippleButton
        rippleColor={colors.blue100}
        rippleOpacity={0.8}
        style={styles.ctaButton}
        onPress={this.onCTAClick}
      >
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Assign</Text>
        </View>
      </RippleButton>
    );
  }
  renderButtons() {
    const { modal } = this.props;

    if (modal && modal.get('actions')) {
      const buttons = modal.get('actions').map((a, i) => {
        const selected = this.state.assignees.get('selectedAssignees').contains(a.props.user.get('id'));

        return (
          <RippleButton
            rippleColor={colors.deepBlue40}
            rippleOpacity={0.8}
            style={styles.button}
            onPress={this.onButtonClick(i, a.props)}
            key={i}
          >
            <View style={styles.button}>
              <HOCAssigning assignees={[a.props.user.get('id')]} />
              <Text style={styles.actionTitle}>{a.title}</Text>
              {this.renderSelection(selected)}
            </View>
          </RippleButton>
        );
      });

      return (
        <View style={styles.modalBox}>
          {this.renderTitle()}
          <ScrollView>
            {buttons}
          </ScrollView>
          {this.renderCTA()}
        </View>
      );
    }

    return undefined;
  }
  render() {
    return (
      <Modal
        animationType={'fade'}
        transparent
        visible={this.state.modalState}
        onRequestClose={this.closeModal}
      >
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={this.closeModal}>
            <View style={styles.tappableOverlay} />
          </TouchableWithoutFeedback>
          {this.renderButtons()}
        </View>
      </Modal>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  modal: {
    width: viewSize.width,
    height: viewSize.height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  tappableOverlay: {
    width: viewSize.width,
    height: viewSize.height,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  modalBox: {
    width: 300,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    elevation: 5,
  },
  titleWrapper: {
    width: 300,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    color: colors.deepBlue100,
  },
  button: {
    width: 300,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 9,
  },
  actionTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.deepBlue80,
    paddingLeft: 15,
  },
  selectionWrapper: {
    width: 30,
    height: 30,
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: colors.deepBlue20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButton: {
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cta: {
    width: 300,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    borderTopWidth: 2,
    borderTopColor: colors.blue100,
  },
  ctaTitle: {
    fontSize: 18,
    color: colors.blue100,
  },
});

function mapStateToProps(state) {
  return {
    modal: state.getIn(['modals', 'modal']),
  };
}

export default connect(mapStateToProps, {
  showModal: a.modals.show,
})(ActionModal);
