import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
// import { fromJS } from 'immutable';
import PostView from './PostView';

class HOCPostView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {

  }
  render() {
    const { meId } = this.props;

    return (
      <PostView meId={meId} delegate={this} />
    );
  }
}

// const { string } = PropTypes;

HOCPostView.propTypes = {};

function mapStateToProps(state, ownProps) {
  return {
    meId: state.getIn(['me', 'id']),
    post: state.getIn(['posts', ownProps.postId])
  };
}

export default connect(mapStateToProps, {
})(HOCPostView);