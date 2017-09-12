import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Modal, Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import * as a from 'actions';
import { colors, viewSize } from 'globalStyles';
import RippleButton from 'RippleButton';
import Icon from 'Icon';
import ActionModalList from './ActionModalList';

class ActionModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modal: null,
    };

    this.closeModal = this.closeModal.bind(this);
    this.onMultipleClick = this.onMultipleClick.bind(this);
    // this.onButtonClick = setupCachedCallback(this.onButtonClick, this);
  }
  componentWillReceiveProps(nextProps) {
    const { modal } = this.state;

    if (nextProps.modal.size > 1 && !modal) {
      this.setState({ modal: nextProps.modal });
    } else if (nextProps.modal.size < 1 && modal) {
      this.setState({ modal: null });
    }
  }
  onItemPress(itemIndex, item, e) {
    let { modal } = this.state;
    if (modal.get('multiple')) {
      modal = modal.updateIn(['items'], items => items.map((dItem, i) => {
        if (itemIndex === dItem.get('index')) {
          return dItem.set('selected', !dItem.get('selected'));
        }
        return dItem;
      }));
      this.setState({ modal });
    } else {
      modal.get('onClick')(item);
    }
  }
  onMultipleClick() {
    const { modal } = this.state;
    const selectedIndexes = [];
    modal.get('items').forEach((item, i) => {
      if (item.get('selected')) {
        selectedIndexes.push(i);
      }
    });
    modal.get('onClick')(selectedIndexes);
  }
  closeModal() {
    const { showModal, modal } = this.props;
    
    if (modal.get('onClose')) {
      console.log('get here?')
      modal.get('onClose')();
    }

    showModal();
  }
  renderCloseButton() {
    const { modal } = this.props;

    if (!modal.get('fullscreen')) {
      return undefined;
    }

    const closeButtonStyles = {
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: -15,
    };

    return (
      <RippleButton style={closeButtonStyles} rippleColor={colors.deepBlue60} rippleOpacity={0.8} onPress={this.closeModal}>
        <View style={closeButtonStyles}>
          <Icon name="Close" width="24" height="24" fill={colors.deepBlue80} />
        </View>
      </RippleButton>
    );
  }
  renderTitle() {
    const { modal } = this.state;

    if (modal && modal.get('title')) {
      let titleStyles = {
        height: 60,
      };

      if (modal.get('fullscreen')) {
        titleStyles = {
          height: 90,
          borderBottomWidth: 1,
          borderBottomColor: colors.deepBlue10,
        };
      }

      return (
        <View style={[styles.titleWrapper, titleStyles]}>
          <Text style={styles.title}>
            {modal.get('title')}
          </Text>
          {this.renderCloseButton()}
        </View>
      );
    }

    return undefined;
  }
  renderList() {
    const { modal } = this.state;

    if (modal && modal.get('items')) {
      return <ActionModalList listItems={modal.get('items')} fullscreen={modal.get('fullscreen')} scrollable={modal.get('scrollable')} multiple={modal.get('multiple')} delegate={this} />;
    }

    return undefined;
  }
  renderAction() {
    const { modal } = this.state;

    if (modal && modal.get('multiple')) {
      return (
        <RippleButton
          rippleColor={colors.blue100}
          rippleOpacity={0.8}
          style={styles.ctaButton}
          onPress={this.onMultipleClick}
        >
          <View style={styles.cta}>
            <Text style={styles.ctaTitle}>{modal.get('multiple')}</Text>
          </View>
        </RippleButton>
      );
    }

    return undefined;
  }
  render() {
    const { modal } = this.props;
    let modalStyles = {
      width: viewSize.width * 0.8,
      maxWidth: 275,
      elevation: 5,
      shadowColor: colors.deepBlue100,
      shadowOffset: {
        width: 0, height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    };

    let animationStyle = 'fade';

    if (modal.get('fullscreen')) {
      modalStyles = {
        width: viewSize.width,
        height: viewSize.height,
      };
      animationStyle = 'slide';
    }

    return (
      <Modal
        animationType={animationStyle}
        transparent
        visible={!!this.state.modal}
        onRequestClose={this.closeModal}
      >
        <View style={styles.modal}>
          <TouchableWithoutFeedback onPress={this.closeModal}>
            <View style={styles.tappableOverlay} />
          </TouchableWithoutFeedback>
          <View style={[styles.modalBox, modalStyles]}>
            {this.renderTitle()}
            {this.renderList()}
            {this.renderAction()}
          </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
  },
  titleWrapper: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: colors.deepBlue100,
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
    flex: 1,
    alignSelf: 'stretch',
    maxHeight: 54,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cta: {
    flex: 1,
    maxHeight: 54,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bgColor,
    borderTopWidth: 2,
    borderTopColor: colors.deepBlue10
  },
  ctaTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 24,
    color: colors.blue100,
    includeFontPadding: false,
    paddingBottom: 2,
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
