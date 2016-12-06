import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { connect } from 'react-redux';
import * as actions from '../../../actions';


class HOCSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  componentDidMount() {
  }
  renderTeams() {

  }
  renderProfile() {

  }
  renderStore() {
    // For later
  }
  render() {
    return (
      <div className="sw-sidebar" />
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
HOCSidebar.propTypes = {
  // removeThis: PropTypes.string.isRequired
};

const ConnectedHOCSidebar = connect(mapStateToProps, {
  onDoing: actions.doStuff,
})(HOCSidebar);
export default ConnectedHOCSidebar;
