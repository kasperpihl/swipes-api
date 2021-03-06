import React, { PureComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RippleButton from 'RippleButton';
import { bindAll } from 'swipes-core-js/classes/utils';
import * as gs from 'styles';
import { viewSize } from 'globalStyles';
import { setupCachedCallback } from 'react-delegate';

const styles = StyleSheet.create({
  alert: {
    width: viewSize.width * .8,
    ...gs.mixins.padding(0, 15),
    backgroundColor: 'white',
    borderRadius: 6,
    elevation: 4,
  },
  titleWrapper: {
    ...gs.mixins.padding(15, 0),
    alignSelf: 'stretch',
  },
  title: {
    ...gs.mixins.font(18, gs.colors.deepBlue100, 21),
    textAlign: 'center'
  },
  messageWrapper: {
    ...gs.mixins.padding(15, 0, 30, 0),
  },
  message: {
    ...gs.mixins.font(15, gs.colors.deepBlue50),
    textAlign: 'center'
  },
  actionsWrapper: {
    ...gs.mixins.border(1, gs.colors.deepBlue20, 'top'),
    ...gs.mixins.flex('row', 'left', 'center'),
  },
  actionButton: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    alignSelf: 'stretch',
  },
  action: {
    ...gs.mixins.size(1),
    ...gs.mixins.flex('center'),
    ...gs.mixins.padding(15, 0),
    alignSelf: 'stretch',
  },
  actionLabel: {
    ...gs.mixins.font(12, gs.colors.deepBlue50),
  }
})

class AlertModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.onPressCached = setupCachedCallback(this.onPress, this);

  }
  componentDidMount() {
  }
  onPress(id, e) {
    const { onConfirmPress, onCancelPress, closeModal } = this.props;

    closeModal();

    if (id === 'confirm' && typeof onConfirmPress === 'function') {
      onConfirmPress(e);
    }

    if (id === 'cancel' && typeof onCancelPress === 'function') {
      onCancelPress(e);
    }
  }
  renderTitle() {
    const { title } = this.props;

    if (!title) return undefined;

    return (
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>
          {title}
        </Text>
      </View>
    )
  }
  renderText() {
    const { message } = this.props;
    
    if (!message) return undefined;

    return (
      <View style={styles.messageWrapper}>
        <Text style={styles.message}>
          {message}
        </Text>
      </View>
    )
  }
  renderCancelButton() {
    const { onCancelPress } = this.props;

    if (onCancelPress) {
      return (
        <RippleButton style={styles.actionButton} onPress={this.onPressCached('cancel')}>
          <View style={styles.action}>
            <Text style={[styles.actionLabel, { color: gs.colors.red80 }]}>CANCEL</Text>
          </View>
        </RippleButton>
      )
    }

    return undefined;
  }
  renderActions() {
    
    return (
      <View style={styles.actionsWrapper}>
        {this.renderCancelButton()}
        <RippleButton style={styles.actionButton} onPress={this.onPressCached('confirm')}>
          <View style={styles.action}>
            <Text style={[styles.actionLabel, { color: gs.colors.blue100 }]}>OK</Text>
          </View>
        </RippleButton>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.alert}>
        {this.renderTitle()}
        {this.renderText()}
        {this.renderActions()}
      </View>
    );
  }
}

export default AlertModal

// const { string } = PropTypes;

AlertModal.propTypes = {};
