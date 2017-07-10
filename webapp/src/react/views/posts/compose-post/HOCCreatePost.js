import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import * as a from 'actions';
// import * as ca from 'swipes-core-js/actions';
// import { setupLoading } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import CreatePost from './CreatePost';

class HOCCreatePost extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.post = fromJS({
      message: props.message || '',
      type: 'knowledge',
      attachments: [],
      taggedPeople: [],
    })
  }
  componentDidMount() {
  }
  onButtonClick(type) {
    console.log('type', type)
  }
  render() {
    const { myId } = this.props;

    return (
      <CreatePost post={this.post} myId={myId} delegate={this} />
    );
  }
}

// const { string } = PropTypes;

HOCCreatePost.propTypes = {};

function mapStateToProps(state) {
  return {
    myId: state.getIn(['me', 'id']),
  };
}

export default connect(mapStateToProps, {

})(HOCCreatePost);