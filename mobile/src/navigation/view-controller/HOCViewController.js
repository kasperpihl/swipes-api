import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import * as a from '../../actions';
import { NavigationExperimental } from 'react-native';
import * as views from '../../views';

const {
  CardStack: NavigationCardStack,
} = NavigationExperimental;

class HOCViewController extends PureComponent {
  constructor(props, context) {
    super(props, context);

    this.renderScene = this.renderScene.bind(this);
    this.navPush = props.navPush.bind(null, props.sliderIndex);
    this.navPop = props.navPop.bind(null, props.sliderIndex);
  }
  reduxToNavigationState(reduxState) {
    return {
      index: reduxState.size - 1,
      routes: reduxState.map((r, i) => r.set('key', `${i}`).toObject()).toArray(),
    };
  }
  renderScene(sceneProps) {
    const { route } = sceneProps.scene;
    const { activeSliderIndex, sliderIndex, routes, setActionButtons } = this.props;
    const Comp = views[route.id];
    let isActive = sliderIndex === activeSliderIndex;
    if (isActive && sceneProps.scene.index !== routes.size - 1) {
      isActive = false;
    }
    return (
      <Comp
        navPush={this.navPush}
        navPop={this.navPop}
        isActive={isActive}
        setActionButtons={setActionButtons}
        {...route.props}
      />
    );
  }
  render() {
    return (
      <NavigationCardStack
        enableGestures={false}
        direction="vertical"
        onNavigateBack={this.navPop}
        navigationState={this.reduxToNavigationState(this.props.routes)}
        renderScene={this.renderScene}
      />
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  activeSliderIndex: state.getIn(['navigation', 'sliderIndex']),
  routes: state.getIn(['navigation', 'sliders', ownProps.sliderIndex, 'routes']),
});

export default connect(mapStateToProps, {
  navPush: a.navigation.push,
  navPop: a.navigation.pop,
  setActionButtons: a.navigation.setActionButtons,
})(HOCViewController);
