import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as a from 'actions';
import * as ca from 'swipes-core-js/actions';
import { setupLoading, convertObjToUnderscore } from 'swipes-core-js/classes/utils';
// import { map, list } from 'react-immutable-proptypes';
import { fromJS } from 'immutable';
import TabMenu from 'context-menus/tab-menu/TabMenu';
import CreatePost from './CreatePost';

class HOCCreatePost extends PureComponent {
  static maxWidth() {
    return 600;
  }
  constructor(props) {
    super(props);
    this.state = {
      post: fromJS({
        message: '',
        type: 'message',
        attachments: [],
        taggedUsers: [],
        context: null,
      })
    };
    setupLoading(this);
  }
  componentDidMount() {
  }
  onSelectAssignees(e) {
    const options = this.getOptionsForE(e);
    const { selectAssignees } = this.props;

    const existingAssignees = this.state.post.get('taggedUsers').toJS();

    selectAssignees(Object.assign({ actionLabel: 'Done' }, options), existingAssignees, (assignees) => {
      let { post } = this.state;
      if (assignees) {
        post = post.set('taggedUsers', fromJS(assignees));
        this.setState({ post });
      }
    });
  }
  onChooseNotificationType(e) {
    const { contextMenu } = this.props;
    const options = this.getOptionsForE(e);

    const items = [
      { icon: 'Status', type: 'message' },
      { icon: 'Feedback', type: 'question' },
      { icon: 'Assets', type: 'announcement' },
      { icon: 'Earth', type: 'information' }
    ].map((i) => {
      i.leftIcon = { icon: i.icon };
      i.title = msgGen.posts.getPostComposeTypeTitle(i.type);
      i.subtitle = msgGen.posts.getPostTypeSubtitle(i.type);
      return i;
    });

    const delegate = {
      onItemAction: (item) => {
        contextMenu(null);
        this.setState({ post: this.state.post.set('type', item.type) });
      },
    };
    contextMenu({
      options,
      component: TabMenu,
      props: {
        delegate,
        items,
        style: {
          width: '360px',
        },
      },
    });
  }
  onTextClick(id, obj, e) {
    let { post } = this.state;
    if (obj.id === 'type') {
      this.onChooseNotificationType(e);
    } else {
      post = post.set('taggedUsers', post.get('taggedUsers').filter(uid => uid !== obj.id));
    }
    this.setState({ post });
  }
  onPostClick(e) {
    const { createPost, navPop } = this.props;
    const { post } = this.state;
    this.setLoading('post');

    createPost(convertObjToUnderscore(post.toJS())).then((res) => {
      if (res.ok) {
        navPop();
      } else {
        this.clearLoading('post', '!Something went wrong');
      }
    })
  }
  onMessageChange(e) {
    let { post } = this.state;
    post = post.set('message', e.target.value);

    this.setState({ post });
  }

  onButtonClick(type, e) {
    if (type === 'type') {
      this.onChooseNotificationType(e);
    } else if (type === 'users') {
      this.onSelectAssignees(e);
    }
  }
  getOptionsForE(e) {
    return {
      boundingRect: e.target.getBoundingClientRect(),
      alignX: 'center',
    }
  }
  render() {
    const { myId } = this.props;
    const { post } = this.state;
    return (
      <CreatePost
        post={post}
        myId={myId}
        delegate={this}
        {...this.bindLoading() }
      />
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
  selectAssignees: a.goals.selectAssignees,
  contextMenu: a.main.contextMenu,
  createPost: ca.posts.create,
})(HOCCreatePost);
