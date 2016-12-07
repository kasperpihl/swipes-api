import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import * as actions from 'actions';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
import Navbar from 'components/nav-bar/NavBar';
import { bindAll } from 'classes/utils';
import Icon from 'Icon';
import * as views from 'views';

class HOCViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    bindAll(this, ['clickedFind']);
  }
  componentDidMount() {
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
  renderNavbar() {
    const { history } = this.props;
    if (!history) {
      return undefined;
    }

    const navbarData = history.map(el => ({
      title: el.get('title'),
    })).toArray();

    return <Navbar history={navbarData} delegate={this} />;
  }
  renderContent() {
    const { history } = this.props;
    if (!history) {
      return undefined;
    }

    const lastEl = history.last();
    const View = views[lastEl.get('component')];
    if (!View) {
      return <div>View ({lastEl.get('component')}) not found!</div>;
    }
    let props = {};

    if (lastEl.get('props')) {
      props = lastEl.get('props').toObject();
    }
    return (
      <View {...props} key={lastEl.get('component')} />
    );
  }

  renderGlobalActions() {
    return (
      <div className="global-actions">
        <div className="global-actions__action" onClick={this.clickedFind}>
          <Icon svg="FindIcon" className="global-actions__icon" />
        </div>
      </div>
    );
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
  return {
    history: state.getIn(['navigation', 'history', navId]),
  };
}

const { func } = PropTypes;
HOCViewController.propTypes = {
  history: list,
  overlayShow: func,
  popTo: func,
  pop: func,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  popTo: actions.navigation.popTo,
  pop: actions.navigation.pop,
  overlayShow: actions.main.overlayShow,
})(HOCViewController);
export default ConnectedHOCViewController;
