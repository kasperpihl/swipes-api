import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import PostFeed from './PostFeed';

class HOCPostFeed extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
  }
  render() {
    return (
      <PostFeed />
    );
  }
}

// const { string } = PropTypes;
HOCPostFeed.propTypes = {};
function mapStateToProps() {
  return {};
}
export default connect(mapStateToProps, {
})(HOCPostFeed);