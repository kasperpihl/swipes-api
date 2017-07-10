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
    const { me } = this.props;

    return (
      <PostView me={me} delegate={this} />
    );
  }
}

// const { string } = PropTypes;

HOCPostView.propTypes = {};

function mapStateToProps(state) {
  return {
    me: state.get('me'),
  };
}

export default connect(mapStateToProps, {
})(HOCPostView);