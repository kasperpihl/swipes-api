import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from '../../../actions';


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

  }
  render() {
    return (
      <div className="className" />
    );
  }
}

function mapStateToProps(state) {
  return {
    main: state.get('main'),
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
