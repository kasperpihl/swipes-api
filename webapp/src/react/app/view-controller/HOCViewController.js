import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as views from '../../views';

class HOCViewController extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  renderNavbar() {

  }
  renderContent() {
    const { history } = this.props;
    if (!history) {
      return undefined;
    }

    const lastEl = history.last();
    const View = views[lastEl.get('component')];
    console.log(views);
    console.log('lastEl', lastEl.toJS(), View);

    if (View) {
      return (
        <View />
      );
    }
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

import { map, mapContains, list, listOf } from 'react-immutable-proptypes';
const { string } = PropTypes;
HOCViewController.propTypes = {
  // removeThis: PropTypes.string.isRequired
};

const ConnectedHOCViewController = connect(mapStateToProps, {
  onDoing: actions.doStuff,
})(HOCViewController);
export default ConnectedHOCViewController;
