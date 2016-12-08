import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from 'actions';
import { connect } from 'react-redux';
import { list, map } from 'react-immutable-proptypes';
import Navbar from 'components/nav-bar/NavBar';
import { bindAll, nearestAttribute } from 'classes/utils';
import Button from 'Button';
import * as views from 'views';
import './styles/view-controller';

class HOCViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['clickedFind', 'onContextClick']);
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
  clickedFind() {
    const {
      overlayShow,
    } = this.props;
    overlayShow({
      component: 'Find',
    });
  }
  navbarClickedBack() {
    const { pop } = this.props;
    pop();
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
            {buttons.map((b, i) => this.renderContextButton(i, b))}
          </div>
        );
      }
    }
    return undefined;
  }
  renderNavbar() {
    const { history } = this.props;
    if (!history) {
      return undefined;
    }

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
    const { history, currentView, View } = this.props;
    if (!history || !currentView) {
      return this.renderLoading();
    }


    if (!View) {
      return <div>View ({currentView.get('component')}) not found!</div>;
    }
    let props = {};
    if (currentView.get('props')) {
      props = currentView.get('props').toObject();
    }

    return (
      <View
        delegate={this}
        key={currentView.get('component')}
        {...props}
      />
    );
  }

  renderGlobalActions() {
    return (
      <div className="global-actions" key="global-actions">
        <div className="global-actions__action" onClick={this.clickedFind}>
          <Button icon="FindIcon" />
        </div>
      </div>
    );
  }
  renderLoading() {
    return <div>Loading</div>;
  }
  render() {
    return (
      <div className="view-controller">
        {this.renderNavbar()}
        {this.renderContent()}
        {this.renderGlobalActions()}
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
    history,
    currentView,
    View,
  };
}

const { func } = PropTypes;
HOCViewController.propTypes = {
  history: list,
  overlayShow: func,
  currentView: map,
  View: func,
  popTo: func,
  pop: func,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  popTo: actions.navigation.popTo,
  pop: actions.navigation.pop,
  overlayShow: actions.main.overlayShow,
})(HOCViewController);
export default ConnectedHOCViewController;
