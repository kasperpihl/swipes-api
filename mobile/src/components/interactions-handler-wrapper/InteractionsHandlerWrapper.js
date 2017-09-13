import React, { PureComponent } from 'react';
import { View, InteractionManager, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from 'globalStyles';

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

class InteractionsHandlerWrapper extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
	    interactionsComplete: false,
    };
  }
  componentDidMount() {
    this.interactionHandle = InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsComplete: true });
      this.interactionHandle = null;
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.loadingProps !== this.props.loadingProps) {
      this.handleInteractionManager();
    }
  }
  componentWillUnmount() {
    if (this.interactionHandle) {
      this.interactionHandle.cancel();
    }
  }
  handleInteractionManager() {
    if (this.interactionHandle) this.interactionHandle.cancel();
    this.setState({ interactionsComplete: false });

    this.interactionHandle = InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsComplete: true });
      this.interactionHandle = null;
    });
  }
  renderLoader() {
    const { customLoader } = this.props;

    if (customLoader) return customLoader;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator color={colors.blue100} size="large"  />
      </View>
    )
  }
  render() {
    const { interactionsComplete } = this.state;
    const { children } = this.props;

    if (interactionsComplete && children) return children;

    if (!interactionsComplete) return this.renderLoader();

    return null;
  }
}

export default InteractionsHandlerWrapper

InteractionsHandlerWrapper.propTypes = {};
