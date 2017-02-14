import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import Button from 'Button';
import * as actions from 'actions';
import * as views from 'views';
import { setupCachedCallback } from 'classes/utils';
import './styles/view-controller';

const reservedNavIds = [
  'slack',
  'gmail',
];

class HOCViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      secondaryOverlay: false,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.bindedNavPush = props.push.bind(this, props.target);
    this.bindedNavPop = props.pop.bind(this, props.target);
    this.onContext = setupCachedCallback(this.callContentView.bind(this, 'onContextClick'), this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.upcomingId !== this.props.upcomingId) {
      this.callContentView('onNavWillChange', nextProps.upcomingId);
    }
  }
  componentWillUnmount() {
    this._contentView = null;
  }
  viewDidLoad(view) {
    this._contentView = view;
  }
  callContentView(name) {
    const orgArgs = Array.prototype.slice.call(arguments, 1);
    if (this._contentView && typeof this._contentView[name] === 'function') {
      this._contentView[name](...orgArgs);
    }
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
  renderContent() {
    const { currentView, View, target } = this.props;

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
      <View
        navPop={this.bindedNavPop}
        navPush={this.bindedNavPush}
        delegate={this}
        target={target}
        key={currentView.get('component')}
        {...props}
      />
    );
  }
  renderContainer() {
    const { history, currentView, navId } = this.props;
    if (reservedNavIds.indexOf(navId) !== -1 || !history || !currentView) {
      return undefined;
    }
    // if (currentView.get('fullscreen')) {
    //   className += ' fullscreen';
    // }
    return [
      this.renderCloseButton(),
      this.renderContent(),
    ];
  }
  renderSlack() {
    const { navId, slackOpenIn, target } = this.props;
    if (target !== 'primary') {
      return undefined;
    }

    const HOCSlack = views.Slack;
    const hidden = navId !== 'slack';
    return (
      <HOCSlack hidden={hidden} openIn={slackOpenIn} />
    );
  }
  render() {
    const { navId, target } = this.props;
    const { secondaryOverlay } = this.state;
    let className = 'view-controller';

    if (!navId) {
      className += ' view-controller--empty';

      return (
        <div className={className}>
          {this.renderContainer()}
          {this.renderSlack()}
        </div>
      );
    }

    if (target && target === 'secondary' && navId && secondaryOverlay) {
      className += ' view-controller--overlay';
    }

    return (
      <section className={className}>
        {this.renderContainer()}
        {this.renderSlack()}
      </section>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const navId = state.getIn(['navigation', ownProps.target, 'id']);
  const history = state.getIn(['navigation', ownProps.target, 'history', navId]);
  const upcomingId = state.getIn(['navigation', ownProps.target, 'upcomingId']);

  const currentView = history ? history.last() : undefined;
  const View = currentView ? views[currentView.get('component')] : undefined;
  return {
    slackOpenIn: state.getIn(['main', 'slackOpenIn']),
    navId,
    upcomingId,
    history,
    currentView,
    View,
  };
}

const { func, string } = PropTypes;
HOCViewController.propTypes = {
  history: list,
  slackOpenIn: string,
  upcomingId: string,
  navId: string,
  currentView: map,
  View: func,
  popTo: func,
  push: func,
  pop: func,
  target: string,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  popTo: actions.navigation.popTo,
  pop: actions.navigation.pop,
  push: actions.navigation.push,
})(HOCViewController);
export default ConnectedHOCViewController;
