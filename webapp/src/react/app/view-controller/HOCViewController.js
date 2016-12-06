import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import { list } from 'react-immutable-proptypes';
import Navbar from '../../components/nav-bar/NavBar';
import { navigation } from '../../../actions';
import * as views from '../../views';

class HOCViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  navbarClickedBack() {
    const { pop } = this.props;
    pop();
  }
  navbarClickedItem(navbar, i) {
    const { popTo } = this.props;
    popTo(i);
  }
  renderNavbar() {
    const { history } = this.props;
    if (!history) {
      return undefined;
    }

    const navbarData = history.map((el) => {
      // Map the data for navbar here.
    });

    // return <Navbar history={navbarData} delegate={this} />;
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

    return (
      <View />
    );
  }
  render() {
    return (
      <div className="view-controller">
        {this.renderNavbar()}
        {this.renderContent()}
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
  popTo: func,
  pop: func,
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  popTo: navigation.popTo,
  pop: navigation.pop,
})(HOCViewController);
export default ConnectedHOCViewController;
