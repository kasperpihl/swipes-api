import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import Navbar from 'components/nav-bar/NavBar';
import Button from 'Button';
import * as actions from 'actions';
import * as views from 'views';
import { bindAll, nearestAttribute } from 'classes/utils';
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
    bindAll(this, ['onContextClick']);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.history !== this.props.history) {
      this._contentView = null;
    }
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
  navbarClickedCrumb(navbar, i) {
    const { popTo } = this.props;
    popTo(i);
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
    const { View, currentView } = this.props;
    if (View && typeof View.contextButtons === 'function') {
      let props = currentView.get('props');
      props = props ? props.toObject() : undefined;
      const buttons = View.contextButtons(props);
      if (buttons && buttons.length) {
        return (
          <div className="nav-bar__actions">
            {buttons.map((b, i) => this.renderContextButton(i, b)).reverse()}
          </div>
        );
      }
    }
    return undefined;
  }
  renderNavbar() {
    const { history } = this.props;

    const navbarData = history.map(el => ({
      title: el.get('title'),
    })).toArray();

    return (
      <Navbar key="navbar" history={navbarData} delegate={this}>
        {this.renderContextButtons()}
      </Navbar>
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
    let className = 'view-controller__content-container';
    if (currentView.get('fullscreen')) {
      className += ' fullscreen';
    }
    return (
      <div className={className}>
        {this.renderNavbar()}
        {this.renderContent()}
      </div>
    );
  }
  renderGmail() {
    const HOCGmail = views.Gmail;
    const { navId } = this.props;
    const hidden = navId !== 'gmail';
    return (
      <HOCGmail hidden={hidden} />
    );
  }
  renderSlack() {
    const HOCSlack = views.Slack;
    const { navId } = this.props;
    const hidden = navId !== 'slack';
    return (
      <HOCSlack hidden={hidden} />
    );
  }
  render() {
    return (
      <div className="view-controller">
        {this.renderContainer()}
        {this.renderSlack()}
        {this.renderGmail()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const navId = state.getIn(['navigation', 'id']);
  const history = state.getIn(['navigation', 'history', navId]);
  const currentView = history ? history.last() : undefined;
  const View = currentView ? views[currentView.get('component')] : undefined;
  return {
    navId,
    history,
    currentView,
    View,
  };
}

const { func, string } = PropTypes;
HOCViewController.propTypes = {
  history: list,
  navId: string,
  currentView: map,
  View: func,
  popTo: func,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  popTo: actions.navigation.popTo,
  pop: actions.navigation.pop,
})(HOCViewController);
export default ConnectedHOCViewController;
