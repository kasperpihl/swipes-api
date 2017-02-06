import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import Navbar from 'components/nav-bar/NavBar';
import Button from 'Button';
import * as actions from 'actions';
import * as views from 'views';
import { bindAll, nearestAttribute, setupCachedCallback } from 'classes/utils';
import './styles/view-controller';

const reservedNavIds = [
  'slack',
  'gmail',
];

class HOCViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    this.bindedNavPush = props.push.bind(this, props.target);
    this.bindedNavPop = props.pop.bind(this, props.target);

    bindAll(this, ['onContextClick']);
  }
  componentWillUnmount() {
    this._contentView = null;
  }
  onContextClick(e) {
    if (this._contentView && typeof this._contentView.onContextClick === 'function') {
      const index = parseInt(nearestAttribute(e.target, 'data-index'), 10);
      this._contentView.onContextClick(index, e);
    }
  }
  viewDidLoad(view) {
    this._contentView = view;
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
      <div key={index} data-index={index} className="nav-bar__action">
        <Comp
          {...props}
          onClick={this.onContextClick}
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

    const navbarData = history.map(el => ({
      title: el.get('title'),
      placeholder: el.get('placeholder'),
    })).toArray();

    return (
      <div className="sw-view__nav-bar">
        <Navbar key="navbar" history={navbarData} delegate={this}>
          {this.renderContextButtons()}
        </Navbar>
      </div>
    );
  }
  renderContent() {
    const { currentView, View } = this.props;

    if (!View) {
      return <div>View ({currentView.get('component')}) not found!</div>;
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
    const HOCSlack = views.Slack;
    const { navId, slackOpenIn } = this.props;
    const hidden = navId !== 'slack';
    return (
      <HOCSlack hidden={hidden} openIn={slackOpenIn} />
    );
  }
  render() {
    return (
      <div className="view-controller">
        {this.renderContainer()}
        {this.renderSlack()}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const navId = state.getIn(['navigation', ownProps.target, 'id']);
  const history = state.getIn(['navigation', ownProps.target, 'history', navId]);

  const currentView = history ? history.last() : undefined;
  const View = currentView ? views[currentView.get('component')] : undefined;
  return {
    slackOpenIn: state.getIn(['main', 'slackOpenIn']),
    navId,
    history,
    currentView,
    View,
  };
}

const { func, string } = PropTypes;
HOCViewController.propTypes = {
  history: list,
  slackOpenIn: string,
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
