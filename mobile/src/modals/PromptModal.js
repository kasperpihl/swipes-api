import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import RippleButton from 'RippleButton';
import * as gs from 'styles';
import { viewSize, colors } from 'globalStyles';
import { setupCachedCallback } from 'react-delegate';

const styles = StyleSheet.create({
  prompt: {
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
  contentWrapper: {
    // backgroundColor: '#333ddd',
  },
  input: {
    ...gs.mixins.size(viewSize.width - 30, 50),
    ...gs.mixins.font(15, colors.deepBlue100, 21),
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

class PromptModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: props.initValue || '',
    };

    this.onPressCached = setupCachedCallback(this.onPress, this);
  }
  componentDidMount() {
  }
  onPress(id, e) {
    const { onConfirmPress, onCancelPress, closeModal } = this.props;
    closeModal();

    if (id === 'confirm' && typeof onConfirmPress === 'function') {
      onConfirmPress(e, this.state.text);
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
        <Text style={styles.title}>{title}</Text>
      </View>
    )
  }
  renderContent() {
    const { placeholder: ph, keyboardType: kT } = this.props;
    const placeholder = ph || 'Placeholder';
    const keyboardType = kT || 'default';
    let extraArgs = {};

    if (keyboardType === 'email-address') {
      extraArgs = {
        autoCapitalize: 'none',
        autoCorrect: false
      }
    }

    return (
      <View style={styles.contentWrapper}>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          placeholder={placeholder}
          onSubmitEditing={this.focusNext}
          placeholderTextColor={colors.deepBlue50}
          underlineColorAndroid="transparent"
          keyboardType={keyboardType}
          autoFocus={true}
          {...extraArgs}
        />
      </View>
    )
  }
  renderActions() {
    
    return (
      <View style={styles.actionsWrapper}>
        <RippleButton style={styles.actionButton} onPress={this.onPressCached('cancel')}>
          <View style={styles.action}>
            <Text style={[styles.actionLabel, { color: gs.colors.red80 }]}>CANCEL</Text>
          </View>
        </RippleButton>
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
      <View style={styles.prompt}>
        {this.renderTitle()}
        {this.renderContent()}
        {this.renderActions()}
      </View>
    );
  }
}

export default PromptModal

// const { string } = PropTypes;

PromptModal.propTypes = {};
