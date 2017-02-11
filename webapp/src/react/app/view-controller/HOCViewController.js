import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import Measure from 'react-measure';
import Navbar from 'components/nav-bar/NavBar';
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
      centerNav: false,
      secondaryOverlay: false,
    };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.bindedNavPush = props.push.bind(this, props.target);
    this.bindedNavPop = props.pop.bind(this, props.target);
    this.onContext = setupCachedCallback(this.callContentView.bind(this, 'onContextClick'), this);
    this.onMeasure = this.onMeasure.bind(this);
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
  onMeasure(dim) {
    if (dim.width < 1200) {
      this.setState({ centerNav: true });
    } else {
      this.setState({ centerNav: false });
    }

    if (dim.width < 800) {
      this.setState({ secondaryOverlay: true });
    } else {
      this.setState({ secondaryOverlay: false });
    }
  }
  navbarInputKeyUp(e) {
    this.callContentView('onInputKeyUp', e);
  }
  navbarInputKeyDown(e) {
    this.callContentView('onInputKeyDown', e);
  }
  navbarInputChange(text) {
    this.callContentView('onInputChange', text);
  }
  callContentView(name) {
    const orgArgs = Array.prototype.slice.call(arguments, 1);
    if (this._contentView && typeof this._contentView[name] === 'function') {
      this._contentView[name](...orgArgs);
    }
  }
  navbarClickedCrumb(i) {
    const { popTo, target } = this.props;
    popTo(target, i);
  }
  renderContextButton(index, button) {
    const Comp = Button;
    const props = button.props || {};
    return (
      <div key={index} className="nav-bar__action">
        <Comp
          {...props}
          onClick={this.onContext(index)}
        />
      </div>
    );
  }
  renderContextButtons() {
    const { View, currentView, target } = this.props;
    let contextButtons = [];
    if (View && typeof View.contextButtons === 'function') {
      let props = currentView.get('props');
      props = props ? props.toObject() : undefined;
      const buttons = View.contextButtons(props);
      if (buttons && buttons.length) {
        contextButtons = buttons.map((b, i) => this.renderContextButton(i, b)).reverse();
      }
    }
    if (target !== 'primary') {
      // contextButtons.push();
    }
    if (contextButtons.length) {
      return (
        <div className="nav-bar__actions">
          {contextButtons}
        </div>
      );
    }
    return undefined;
  }
  renderNavbar() {
    const { history } = this.props;
    const { centerNav } = this.state;
    let className = 'sw-view__nav-bar';
    const navbarData = history.map(el => ({
      title: el.get('title'),
      placeholder: el.get('placeholder'),
    })).toArray();

    if (centerNav) {
      className += ' sw-view__nav-bar--center';
    }

    return (
      <div className={className} key="navbar">
        <Navbar history={navbarData} delegate={this}>
          {this.renderContextButtons()}
        </Navbar>
      </div>
    );
  }
  renderContent() {
    const { currentView, View } = this.props;

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
      this.renderNavbar(),
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
      className = 'view-controller--empty';
    }

    if (target && target === 'secondary' && navId && secondaryOverlay) {
      className += ' view-controller--overlay';
    }

    return (
      <Measure onMeasure={this.onMeasure}>
        <div className={className}>
          {this.renderContainer()}
          {this.renderSlack()}
        </div>
      </Measure>
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
