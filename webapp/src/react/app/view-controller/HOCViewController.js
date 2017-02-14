import React, { PureComponent, PropTypes } from 'react';
import { connect } from 'react-redux';
import { map } from 'react-immutable-proptypes';
import Button from 'Button';
import * as actions from 'actions';
import * as views from 'views';
import { setupCachedCallback } from 'classes/utils';
import './styles/view-controller';

const reservedNavIds = [
  'slack',
];

class HOCViewController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
    };
    this.onPopCached = setupCachedCallback(props.pop, this);
    this.onPushCached = setupCachedCallback(props.push, this);
  }
  componentDidMount() {
    this.updateWidth();
  }
  updateWidth() {
    this.setState({ width: this.refs.controller.clientWidth });
  }
  renderCloseButton() {
    const { navId, target } = this.props;

    if (target && target === 'secondary' && navId) {
      return (
        <Button small icon="Close" className="view-controller__close-button" key="close-button" />
      );
    }

    return undefined;
  }
  renderContent(currentView, View, target) {
    if (!View) {
      return <div key="not-found">View ({currentView.get('component')}) not found!</div>;
    }
    let props = {};
    if (currentView.get('props')) {
      props = currentView.get('props').toObject();
    }
    if (currentView.get('savedState')) {
      props.savedState = currentView.get('savedState');
    }

    return (
      <section className="view-container">
        <View
          navPop={this.onPopCached(target)}
          navPush={this.onPushCached(target)}
          openSecondary={this.onPushCached('secondary')}
          delegate={this}
          target={target}
          key={currentView.get('component')}
          {...props}
        />
      </section>
    );
  }

  renderSlack() {
    const { navId, target } = this.props;
    if (target !== 'primary') {
      return undefined;
    }

    const HOCSlack = views.Slack;
    const hidden = navId !== 'slack';
    return (
      <HOCSlack hidden={hidden} />
    );
  }
  renderSecondary() {

  }
  renderPrimary() {
    const target = 'primary';
    const { navigation } = this.props;
    const history = navigation.get(target);
    const currentView = history.last();
    const View = views[currentView.get('component')];
    return this.renderContent(currentView, View, target);
  }
  render() {
    return (
      <div ref="controller" className="view-controller">
        {this.renderPrimary()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    navigation: state.get('navigation'),
  };
}

const { func, string } = PropTypes;
HOCViewController.propTypes = {
  navigation: map,
  navId: string,
  push: func,
  pop: func,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  pop: actions.navigation.pop,
  push: actions.navigation.push,
})(HOCViewController);
export default ConnectedHOCViewController;
